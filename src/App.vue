<script setup lang="ts">
import GameMenu from '@/components/sudoku/GameMenu.vue';
import SudokuControls from '@/components/sudoku/SudokuControls.vue';
import SudokuGrid from '@/components/sudoku/SudokuGrid.vue';
import { useGlobalInputs } from './composables/globalInputs';

useGlobalInputs();
</script>

<template>
  <div class="wrapper">
    <main>
      <section>
        <SudokuGrid />
      </section>
      <aside>
        <GameMenu />
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
  display: flex;
  gap: 20px;
}

aside {
  display: flex;
  flex-direction: column;
  gap: 50px;
}
</style>
