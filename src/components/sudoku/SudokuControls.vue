<script setup lang="ts">
import { BOARD_SIZE } from '@/constants';
import { useSudokuStore } from '@/stores/sudoku';
import { storeToRefs } from 'pinia';
import Button from 'primevue/button';
import { computed } from 'vue';

const sudokuStore = useSudokuStore();
const { setValueOnSelected, eraseDisqualifiedMarks, undo, redo, setActiveMenu } = sudokuStore;
const { sudokuGrid, cannotRedo, cannotUndo, activeMenu } = storeToRefs(sudokuStore);

const digitCounts = computed(() => {
  return Object.values(sudokuGrid.value).reduce(
    (counts, cell) => {
      if (cell.value in counts) counts[cell.value]++;
      else counts[cell.value] = 1;
      return counts;
    },
    {} as Record<string, number>
  );
});
</script>

<template>
  <div class="big-wrapper">
    <div v-if="false">
      <button
        type="button"
        class="time-travel-button"
        :disabled="cannotUndo"
        title="Hotkey: Ctrl + z"
        @click="undo"
      >
        Undo
      </button>
      <button
        type="button"
        class="time-travel-button"
        :disabled="cannotRedo"
        title="Hotkey: Ctrl + Shift + z"
        @click="redo"
      >
        Redo
      </button>
    </div>
    <div class="wrapper">
      <div class="numpad" v-show="activeMenu === 'digit'">
        <Button
          class="digits--button"
          :label="String(i)"
          severity="secondary"
          v-for="i in 9"
          :key="i"
          :disabled="digitCounts[i] >= BOARD_SIZE"
          @click="setValueOnSelected(i)"
        />
        <Button
          icon="pi pi-delete-left"
          severity="secondary"
          class="digits--button delete"
          @click="setValueOnSelected(0)"
        />
      </div>
      <div class="numpad" v-show="activeMenu === 'side'">
        <Button
          class="digits--button side-button"
          :label="String(i)"
          severity="secondary"
          v-for="i in 9"
          :disabled="digitCounts[i] >= BOARD_SIZE"
          :key="i"
          @click="setValueOnSelected(i)"
        />
        <Button
          icon="pi pi-delete-left"
          severity="secondary"
          class="digits--button delete"
          @click="setValueOnSelected(0)"
        />
      </div>
      <div class="numpad" v-show="activeMenu === 'center'">
        <Button
          class="digits--button center-button"
          :label="String(i)"
          severity="secondary"
          v-for="i in 9"
          :disabled="digitCounts[i] >= BOARD_SIZE"
          :key="i"
          @click="setValueOnSelected(i)"
        />
        <Button
          icon="pi pi-delete-left"
          severity="secondary"
          class="digits--button delete"
          @click="setValueOnSelected(0)"
        />
      </div>
      <div class="menu-select">
        <Button
          class="menu-select--button"
          label="Digit"
          v-tooltip="{ value: 'z', showDelay: 500 }"
          :severity="activeMenu === 'digit' ? 'primary' : 'secondary'"
          @click="setActiveMenu('digit')"
        />
        <Button
          class="menu-select--button"
          label="Side"
          v-tooltip="{ value: 'x', showDelay: 500 }"
          :severity="activeMenu === 'side' ? 'primary' : 'secondary'"
          @click="setActiveMenu('side')"
        />
        <Button
          class="menu-select--button"
          label="Center"
          v-tooltip="{ value: 'c', showDelay: 500 }"
          :severity="activeMenu === 'center' ? 'primary' : 'secondary'"
          @click="setActiveMenu('center')"
        />
      </div>
    </div>
    <Button
      label="Clean Up Pencil Marks"
      icon="pi pi-pencil"
      @click="eraseDisqualifiedMarks"
      severity="secondary"
      v-tooltip="{ value: '` or .', showDelay: 500 }"
    />
  </div>
</template>

<style scoped>
.big-wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.time-travel-button {
  padding: 5px 10px;
  font-size: 1.2rem;
}

.wrapper {
  display: flex;
  gap: 10px;
}

.numpad {
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(4, 60px);
  gap: 2px;
}

.menu-select {
  display: grid;
  grid-template-rows: repeat(3, 60px);
  gap: 2px;
}

.menu-select--button {
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px 20px;
}

.menu-select--button.selected {
  border: 2px solid rgb(100, 141, 255);
}

.digits--button {
  font-size: 1.5rem;
}

.digits--button:disabled {
  cursor: auto;
}

.digits--button.delete {
  grid-column: 2 / span 2;
  width: 100%;
}

.digits--button.delete :deep(.pi) {
  font-size: 1.5rem;
}

.side-button {
  font-size: 1.1rem;
  display: flex;
  padding: 5px;
  align-items: flex-start;
}

:deep(.side-button span) {
  flex: none;
}

.side-button:nth-child(3n + 2) {
  justify-content: center;
}

.side-button:nth-child(n + 4):nth-child(-n + 6) {
  align-items: center;
}

.side-button:nth-child(3n) {
  justify-content: end;
}

.side-button:nth-child(n + 7) {
  align-items: end;
}

.side-button:nth-child(5) {
  align-items: center;
  justify-content: center;
}

.center-button {
  font-size: 1.1rem;
}

.erase-marks {
  padding: 5px 10px;
  font-size: 1.2rem;
}
</style>
