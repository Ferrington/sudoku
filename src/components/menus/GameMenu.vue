<script setup lang="ts">
import NewGameMenu from '@/components/menus/NewGameMenu.vue';
import { useSudokuStore } from '@/stores/sudoku';
import type { SudokuGrid } from '@/types';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Dialog from 'primevue/dialog';
import InlineMessage from 'primevue/inlinemessage';
import { type Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import { ref } from 'vue';

type Solution = {
  message: string;
  severity: 'warn' | 'info' | 'success';
  timer: number | undefined;
};

const sudokuStore = useSudokuStore();
const { newGame, importGame, isCorrect, isComplete, clearSelected } = sudokuStore;
const { difficulty } = storeToRefs(sudokuStore);
const showModal = ref(false);
const solution = ref<Solution>({
  message: '',
  severity: 'info',
  timer: undefined,
});

function startNewGame(diff: Difficulty) {
  clearSelected();
  showModal.value = false;
  newGame(diff);
}

function startImportGame(sudoduGrid: SudokuGrid, solvedGrid: SudokuGrid) {
  clearSelected();
  showModal.value = false;
  importGame(sudoduGrid, solvedGrid);
}

function checkSolution() {
  if (!isCorrect()) {
    solution.value.message = "Something isn't quite right.";
    solution.value.severity = 'warn';
  } else {
    const completed = isComplete();
    solution.value.message = completed ? 'Puzzle Completed!' : 'Looks good so far!';
    solution.value.severity = completed ? 'success' : 'info';
  }

  window.clearTimeout(solution.value.timer);

  solution.value.timer = window.setTimeout(() => {
    solution.value.message = '';
  }, 5000);
}
</script>

<template>
  <div>
    <div class="wrapper">
      <div class="new-game-wrapper">
        <div class="difficulty">
          {{ difficulty }}
        </div>
      </div>
      <div class="check-wrapper">
        <InlineMessage
          v-show="solution.message"
          class="inline-message"
          :severity="solution.severity"
          >{{ solution.message }}</InlineMessage
        >
        <Button
          label="Check"
          icon="pi pi-check"
          icon-pos="right"
          size="small"
          severity="secondary"
          @click="checkSolution"
        />
        <Button
          label="New Game"
          icon="pi pi-plus"
          icon-pos="right"
          size="small"
          @click="showModal = true"
        />
      </div>
    </div>

    <Dialog
      v-model:visible="showModal"
      position="top"
      :draggable="false"
      modal
      dismissable-mask
      header="New Game"
    >
      <NewGameMenu @new-game="startNewGame" @import-game="startImportGame" />
    </Dialog>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  justify-content: space-between;
  padding-inline: 5px;
}

.check-wrapper {
  display: flex;
  gap: 10px;
  align-items: flex-end;
}

.inline-message {
  height: 38px;
}

.new-game-wrapper {
  display: flex;
  align-items: flex-end;
  gap: 20px;
}

.difficulty {
  position: relative;
  top: 2px;
  font-size: 2rem;
  font-weight: bold;
  color: var(--bluegray-700);
}
</style>
