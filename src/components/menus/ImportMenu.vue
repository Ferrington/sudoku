<script setup lang="ts">
import { ref } from 'vue';

const puzzleString = ref('');
defineEmits(['newGame']);
</script>

<template>
  <h2>Import a puzzle</h2>
  <input type="text" size="60" v-model="puzzleString" />
  <div class="button-wrapper">
    <button type="button" class="button" @click="$emit('newGame', puzzleString.trim())">
      Start Game
    </button>
  </div>
</template>

<style scoped>
.button-wrapper {
  margin-top: 20px;
  width: 100%;
  display: flex;
  justify-content: flex-end;
}
</style>
