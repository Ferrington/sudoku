<script setup lang="ts">
import GameMenu from '@/components/menus/GameMenu.vue';
import HintMenu from '@/components/menus/HintMenu.vue';
import SudokuControls from '@/components/sudoku/SudokuControls.vue';
import SudokuGrid from '@/components/sudoku/SudokuGrid.vue';
import { useGlobalInputs } from '@/composables/globalInputs';
import { useSudokuStore } from '@/stores/sudoku';

const sudokuStore = useSudokuStore();
const { newGame } = sudokuStore;

useGlobalInputs();
newGame('easy');
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
</template>

<style scoped>
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
