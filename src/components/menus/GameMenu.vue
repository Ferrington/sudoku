<script setup lang="ts">
import TheModal from '@/components/base/TheModal.vue';
import ImportMenu from '@/components/menus/ImportMenu.vue';
import NewGameMenu from '@/components/menus/NewGameMenu.vue';
import { useSudokuStore } from '@/stores/sudoku';
import { storeToRefs } from 'pinia';
import { type Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import { ref } from 'vue';

const sudokuStore = useSudokuStore();
const { newGame, importGame, isCorrect, isComplete, clearSelected, getHint } = sudokuStore;
const { solutionReady } = storeToRefs(sudokuStore);
const showNewGameModal = ref(false);
const showImportModal = ref(false);
const solution = ref({
  message: '',
  bad: false,
});

function checkSolution() {
  if (!isCorrect()) {
    solution.value.message = "Something isn't quite right =\\";
    solution.value.bad = true;
    return;
  }
  solution.value.message = isComplete() ? 'Puzzle Completed! Nice work!' : 'Looks good so far!';
  solution.value.bad = false;
}

function startNewGame(difficulty: Difficulty) {
  clearSelected();
  showNewGameModal.value = false;
  newGame(difficulty);
}

function startImportGame(puzzleString: string) {
  clearSelected();
  importGame(puzzleString);
  showImportModal.value = false;
}
</script>

<template>
  <div class="wrapper">
    <button type="button" class="button" @click="showNewGameModal = true">New Game</button>
    <button type="button" class="button" @click="showImportModal = true">Import Puzzle</button>
  </div>
  <div>
    <button type="button" class="button" :disabled="!solutionReady" @click="checkSolution">
      Check Solution
    </button>
    <button type="button" class="button" @click="getHint">Get Hint</button>
    <p :class="{ wrong: solution.bad, message: true }">{{ solution.message }}</p>
  </div>
  <TheModal v-if="showNewGameModal" @close="showNewGameModal = false">
    <NewGameMenu @new-game="startNewGame" />
  </TheModal>
  <TheModal v-if="showImportModal" @close="showImportModal = false">
    <ImportMenu @new-game="startImportGame" />
  </TheModal>
</template>

<style scoped>
.wrapper {
  display: flex;
  gap: 5px;
}

.button {
  padding: 5px;
  font-size: 1rem;
}

.wrong {
  color: red;
}

.message {
  margin-top: 5px;
  font-size: 1.2rem;
}
</style>
@/stores/sudoku
