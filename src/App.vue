<script setup lang="ts">
import GameMenu from './components/GameMenu.vue';
import SudokuControls from './components/SudokuControls.vue';
import SudokuGrid from './components/SudokuGrid.vue';
import { useMenuStore } from './stores/menu';
import { useSelectedStore } from './stores/selected';

const { arrowKeyMove, setValueOnSelected } = useSelectedStore();
const { setActiveMenu } = useMenuStore();

window.addEventListener('keydown', (e) => {
  if (e.key === 'z') setActiveMenu('digit');
  else if (e.key === 'x') setActiveMenu('side');
  else if (e.key === 'c') setActiveMenu('center');
  else if (['Delete', 'Backspace'].includes(e.key)) {
    setValueOnSelected(0);
  } else if (!isNaN(Number(e.key))) {
    setValueOnSelected(Number(e.key));
  } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
    arrowKeyMove(e.key, e.getModifierState('Shift'));
  }
});
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
