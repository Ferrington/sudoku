<script setup lang="ts">
import type { Difficulty } from '@/types';
import { ref } from 'vue';

defineEmits(['newGame']);
const difficulty = ref<Difficulty>('easy');
</script>

<template>
  <h2>Choose your difficulty</h2>
  <div class="modal-wrapper">
    <select class="difficulty-select" v-model="difficulty">
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
      <option value="expert">Expert</option>
    </select>
    <button type="button" class="button" @click="$emit('newGame', difficulty)">Start Game</button>
  </div>
</template>

<style scoped>
:is(.button, .difficulty-select) {
  padding: 5px;
  font-size: 1rem;
}
</style>
