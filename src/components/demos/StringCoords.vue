<script setup lang="ts">
import SudokuGrid from '@/components/sudoku/SudokuGrid.vue';
import { BOARD_SIZE } from '@/constants';
import { useSudokuStore } from '@/stores/sudoku';
import { generateBoardFromString } from '@/utils/generateBoard';
import { coordsToString } from '@/utils/utils';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { computed, ref } from 'vue';

const sudokuStore = useSudokuStore();
const { importGame, clearHint } = sudokuStore;
const { sudokuGrid, hint } = storeToRefs(sudokuStore);

clearHint();

const puzzleString =
  '000105000140000670080002400063070010900000003010090520007200080026000035000409000';

const blankPuzzle = generateBoardFromString('0'.repeat(81));

importGame(blankPuzzle, blankPuzzle);

const loopIter = ref(-1);
const disableControls = ref(false);

const y = computed(() => Math.floor(loopIter.value / BOARD_SIZE));
const x = computed(() => loopIter.value % BOARD_SIZE);
increment();

function increment() {
  loopIter.value++;
  const n = Number(puzzleString[loopIter.value]);
  const coords = coordsToString(y.value, x.value);
  sudokuGrid.value[coords].value = n;
  if (hint.value != null) {
    hint.value.primaryCells = [coords];
  }
  if (n > 0) {
    sudokuGrid.value[coords].given = true;
  }
}

function decrement() {
  const coords = coordsToString(y.value, x.value);
  sudokuGrid.value[coords].value = 0;
  sudokuGrid.value[coords].given = false;
  loopIter.value--;
  if (hint.value != null) {
    hint.value.primaryCells = [coordsToString(y.value, x.value)];
  }
}

function fastForward() {
  if (loopIter.value >= 80) {
    disableControls.value = false;
    return;
  }

  disableControls.value = true;
  increment();
  setTimeout(() => {
    fastForward();
  }, 50);
}

function rewind() {
  if (loopIter.value <= 0) {
    disableControls.value = false;
    return;
  }

  disableControls.value = true;
  decrement();
  setTimeout(() => {
    rewind();
  }, 50);
}
</script>

<template>
  <div class="puzzle-string">
    <span v-for="(num, i) in puzzleString" :key="i" :class="{ highlight: i === loopIter }">{{
      num
    }}</span>
  </div>
  <div class="code">
    <pre>{{ 'for (let i = 0; i < puzzleString.length; i++) {' }}   // i = {{ loopIter }}</pre>
    <pre>  const y = Math.floor(i / BOARD_SIZE);           // y = {{ y }}</pre>
    <pre>  const x = i % BOARD_SIZE;                       // x = {{ x }}</pre>
    <pre>  const coords = [y, x];                     // coords = [{{ y }},{{ x }}]</pre>
    <pre>{{ '}' }}</pre>
  </div>
  <div class="grid">
    <div></div>
    <div class="legend legend-top">
      <span v-for="n of 9" :key="n">{{ n - 1 }}</span>
    </div>
    <div class="legend legend-left">
      <span v-for="n of 9" :key="n">{{ n - 1 }}</span>
    </div>
    <div>
      <SudokuGrid />
    </div>
    <div></div>
    <div class="controls">
      <Button label="<<" :disabled="loopIter == 0 || disableControls" @click="rewind"></Button>
      <Button label="i--" :disabled="loopIter == 0 || disableControls" @click="decrement"></Button>
      <Button label="i++" :disabled="loopIter == 80 || disableControls" @click="increment"></Button>
      <Button
        label=">>"
        :disabled="loopIter == 80 || disableControls"
        @click="fastForward"
      ></Button>
    </div>
  </div>
</template>

<style scoped>
.puzzle-string {
  width: fit-content;
  display: grid;
  grid-template-columns: repeat(41, auto);
}
.puzzle-string span {
  font-size: 2rem;
}
.grid {
  width: fit-content;
  display: grid;
  grid-template-columns: auto 652px;
  margin: 0 auto;
  margin-top: 20px;
}

.legend {
  display: flex;
}

.legend-top {
  padding-inline: 34px;
  gap: 58px;
}

.legend-left {
  flex-direction: column;
  width: 20px;
  padding-block: 28px;
  gap: 43px;
}

.legend span {
  font-size: 1.5rem;
  color: var(--text-color);
}

.code {
  margin-top: 10px;
}

.code pre {
  font-family: 'Courier New', Courier, monospace;
  font-size: 1.2rem;
  background: var(--surface-200);
  margin: 0;
}

.controls {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 50px;
}

.controls button :deep(span) {
  font-family: 'Courier New', Courier, monospace;
  letter-spacing: 2px;
}

.highlight {
  background: var(--green-200);
  outline: 1px solid black;
}
</style>
