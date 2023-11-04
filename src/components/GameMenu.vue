<script setup lang="ts">
import { useSudokuStore } from '@/stores/sudoku';
import { type Difficulty } from 'sudoku-gen/dist/types/difficulty.type';
import { reactive, ref } from 'vue';

const { newGame, isCorrect, isComplete } = useSudokuStore();
const difficulty = ref<Difficulty>('easy');
const solution = reactive({
  message: '',
  bad: false,
});

function checkSolution() {
  if (isCorrect()) {
    if (isComplete()) {
      solution.message = 'Puzzle Completed! Nice work!';
      solution.bad = false;
    } else {
      solution.message = 'Looks good so far!';
      solution.bad = false;
    }
  } else {
    solution.message = "Something isn't quite right =\\";
    solution.bad = true;
  }
}
</script>

<template>
  <div class="wrapper">
    <select class="difficulty-select" v-model="difficulty">
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
      <option value="expert">Expert</option>
    </select>
    <button type="button" class="new-game-button" @click="newGame(difficulty)">New Game</button>
  </div>
  <div>
    <button type="button" class="check-solution" @click="checkSolution">Check Solution</button>
    <p :class="{ wrong: solution.bad, message: true }">{{ solution.message }}</p>
  </div>
</template>

<style scoped>
.wrapper {
  display: flex;
  gap: 5px;
}

:is(.new-game-button, .difficulty-select, .check-solution) {
  padding: 2px;
}

.wrong {
  color: red;
}

.message {
  margin-top: 5px;
  font-size: 0.8rem;
}
</style>
