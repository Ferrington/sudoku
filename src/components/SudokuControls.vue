<script setup lang="ts">
import { BOARD_SIZE } from '@/assets/constants';
import { useMenuStore } from '@/stores/menu';
import { useSudokuGridStore } from '@/stores/sudokuGrid';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const sudokuStore = useSudokuGridStore();
const { setValueOnSelected, eraseDisqualifiedMarks } = sudokuStore;
const { sudokuGrid } = storeToRefs(sudokuStore);

const menuStore = useMenuStore();
const { setActiveMenu } = menuStore;
const { activeMenu } = storeToRefs(menuStore);

const digitCounts = computed(() => {
  return sudokuGrid.value.flat().reduce(
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
  <div class="wrapper">
    <div class="numpad" v-show="activeMenu === 'digit'">
      <button
        type="button"
        class="digits--button"
        v-for="i in 9"
        :key="i"
        :disabled="digitCounts[i] >= BOARD_SIZE"
        @click="setValueOnSelected(i)"
      >
        {{ i }}
      </button>
      <button type="button" class="digits--button delete" @click="setValueOnSelected(0)">
        Clear
      </button>
    </div>
    <div class="numpad" v-show="activeMenu === 'side'">
      <button
        type="button"
        class="digits--button side-button"
        v-for="i in 9"
        :disabled="digitCounts[i] >= BOARD_SIZE"
        :key="i"
        @click="setValueOnSelected(i)"
      >
        {{ i }}
      </button>
      <button type="button" class="digits--button delete" @click="setValueOnSelected(0)">
        Clear
      </button>
    </div>
    <div class="numpad" v-show="activeMenu === 'center'">
      <button
        type="button"
        class="digits--button center-button"
        v-for="i in 9"
        :disabled="digitCounts[i] >= BOARD_SIZE"
        :key="i"
        @click="setValueOnSelected(i)"
      >
        {{ i }}
      </button>
      <button type="button" class="digits--button delete" @click="setValueOnSelected(0)">
        Clear
      </button>
    </div>
    <div class="menu-select">
      <button
        type="button"
        :class="{ 'menu-select--button': true, selected: activeMenu === 'digit' }"
        title="Hotkey: z"
        @click="setActiveMenu('digit')"
      >
        Digit
      </button>
      <button
        type="button"
        :class="{ 'menu-select--button': true, selected: activeMenu === 'side' }"
        title="Hotkey: x"
        @click="setActiveMenu('side')"
      >
        Side
      </button>
      <button
        type="button"
        :class="{ 'menu-select--button': true, selected: activeMenu === 'center' }"
        title="Hotkey: c"
        @click="setActiveMenu('center')"
      >
        Center
      </button>
    </div>
  </div>
  <button class="erase-marks" title="Hotkey: ." @click="eraseDisqualifiedMarks">
    Remove Disqualified Marks
  </button>
</template>

<style scoped>
.wrapper {
  display: flex;
  gap: 10px;
  font-family: Arial, Helvetica, sans-serif;
}

.numpad {
  display: grid;
  grid-template-columns: repeat(3, 60px);
  grid-template-rows: repeat(4, 60px);
  gap: 2px;
}

.menu-select {
  width: 60px;
  display: grid;
  grid-template-rows: repeat(3, 60px);
  gap: 2px;
}

.menu-select--button {
  font-family: inherit;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px 20px;
}

.menu-select--button.selected {
  border: 2px solid rgb(100, 141, 255);
}

.digits--button {
  font-size: 1.5rem;
  font-weight: bold;
  cursor: pointer;
  font-family: inherit;
}

.digits--button.delete {
  grid-column: 2 / span 2;
}

.side-button {
  font-size: 1.1rem;
  display: flex;
  padding: 5px;
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
