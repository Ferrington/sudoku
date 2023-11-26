<script setup lang="ts">
import SudokuGrid from '@/components/sudoku/SudokuGrid.vue';
import { useSudokuStore } from '@/stores/sudoku';
import { generateBoardFromString } from '@/utils/generateBoard';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { ref } from 'vue';

const sudokuStore = useSudokuStore();
const { importGame, setSelected } = sudokuStore;
const { sudokuGrid } = storeToRefs(sudokuStore);

const blankPuzzle = generateBoardFromString('0'.repeat(81));
setSelected('0,0');
importGame(blankPuzzle, blankPuzzle);

const loopIter = ref(0);
const disableControls = ref(false);
</script>

<template>
  <div class="code">
    <pre>{{ 'for (let i = 0; i < puzzleString.length; i++) {' }}   // i = {{ loopIter }}</pre>
    <pre>  const y = Math.floor(i / BOARD_SIZE);           // y =</pre>
    <pre>  const x = i % BOARD_SIZE;                       // x =</pre>
    <pre>  const coords = [y, x];                     // coords =</pre>
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
  background: var(--blue-200);
  outline: 1px solid black;
}
</style>
