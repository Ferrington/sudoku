<script setup lang="ts">
import { useSudokuStore } from '@/stores/sudoku';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';

const sudokuStore = useSudokuStore();
const { getHint } = sudokuStore;
const { solutionReady } = storeToRefs(sudokuStore);
</script>

<template>
  <div>
    <Button
      label="Hint"
      icon="pi pi-question"
      size="small"
      severity="secondary"
      @click="getHint"
      icon-pos="right"
      :loading="!solutionReady"
    />
  </div>
</template>

<style scoped></style>
