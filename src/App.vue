<script setup lang="ts">
import GameMenu from '@/components/menus/GameMenu.vue';
import HintMenu from '@/components/menus/HintMenu.vue';
import SudokuControls from '@/components/sudoku/SudokuControls.vue';
import SudokuGrid from '@/components/sudoku/SudokuGrid.vue';
import { useGlobalInputs } from '@/composables/globalInputs';
import { useSolve } from '@/composables/solve';
import { useSolveNew } from '@/composables/solveNew';
import { useSudokuStore } from '@/stores/sudoku';
import { generateBoardFromString } from '@/utils/generateBoard';
import Button from 'primevue/button';
import { ref, watch } from 'vue';

const sudokuStore = useSudokuStore();
const { newGame } = sudokuStore;

const { solve, solutionStatus } = useSolve();
const { solve: solveNew, solutionStatus: solutionStatusNew } = useSolveNew();

useGlobalInputs();
newGame('easy');

const oldTime = ref(0);
const newTime = ref(0);

function runTestOld() {
  const puzzle = generateBoardFromString(
    '100000002090400050006000700050903000000070000000850040700000600030009080002000001'
  );
  oldTime.value = Date.now();
  solve(puzzle);
}

watch(solutionStatus, (status) => {
  if (status === 'solved') {
    oldTime.value = Math.floor((Date.now() - oldTime.value) / 1000);
  }
});

function runTestNew() {
  const puzzle = generateBoardFromString(
    '100000002090400050006000700050903000000070000000850040700000600030009080002000001'
  );
  newTime.value = Date.now();
  solveNew(puzzle);
}

watch(solutionStatusNew, (status) => {
  if (status === 'solved') {
    newTime.value = Math.floor((Date.now() - newTime.value) / 1000);
  }
});
</script>

<template>
  <div class="wrapper">
    <main>
      <aside class="game-menu">
        <GameMenu />
      </aside>
      <div></div>
      <section>
        <SudokuGrid />
      </section>
      <aside class="control-menu">
        <HintMenu />
        <SudokuControls />
      </aside>
    </main>
  </div>
  <div><Button label="Test Old" @click="runTestOld" />{{ oldTime }}</div>
  <div :style="{ marginBlock: 30 + 'px' }">
    <Button label="Test New" @click="runTestNew" />{{ newTime }}
  </div>
</template>

<style scoped lang="scss">
.wrapper {
  display: flex;
  justify-content: center;
  user-select: none;
}

main {
  padding: 50px;
  display: grid;
  grid-template-columns: auto 296px;
  gap: 20px;
}

.control-menu {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-block: 5px;
}

.hint-message {
  text-align: center;
}
</style>
