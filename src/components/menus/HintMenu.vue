<script setup lang="ts">
import { useSudokuStore } from '@/stores/sudoku';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import Fieldset from 'primevue/fieldset';

const sudokuStore = useSudokuStore();
const { getHint, clearHint } = sudokuStore;
const { hint } = storeToRefs(sudokuStore);
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
    />
    <Fieldset v-show="hint?.message" class="hint" :legend="hint?.heading">
      {{ hint?.message }}
      <Button icon="pi pi-times" class="close-hint" text rounded size="small" @click="clearHint" />
    </Fieldset>
  </div>
</template>

<style scoped>
.hint {
  margin-top: 20px;
  position: relative;
  line-height: 1.4rem;
}

.hint :deep(.p-fieldset-legend) {
  background: var(--purple-500);
  color: white;
  padding: 1rem;
}

.close-hint {
  position: absolute;
  top: -15px;
  right: 7px;
  cursor: pointer;
  width: 30px;
  height: 30px;
  padding: 0;
  color: var(--bluegray-700);
}
</style>
