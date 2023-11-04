<script setup lang="ts">
import { useSelectedStore } from '@/stores/selected';
import { useSudokuStore } from '@/stores/sudoku';
import type { Cell, Coords } from '@/types';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const sudokuStore = useSudokuStore();
const { grid } = storeToRefs(sudokuStore);
const selectedStore = useSelectedStore();
const { setSelected, appendSelected, selectAll } = selectedStore;
const { selectedCells } = storeToRefs(selectedStore);

const props = defineProps(['boxNumber', 'cellNumber']);
const coords = computed((): Coords => getCoords());
const isSelected = computed((): Boolean => {
  return selectedCells.value.some(([_y, _x]) => {
    const [y, x] = coords.value;
    return y === _y && x === _x;
  });
});
const cell = computed((): Cell => {
  const [y, x] = coords.value;
  return grid.value[y][x];
});
const centerMarksSize = computed(() => {
  const charCount = cell.value.pencilMarks.length;
  const fontSize = 0.7 - 0.1 * Math.max(charCount - 5, 0);
  return fontSize + 'rem';
});

function getCoords(): Coords {
  const y = Math.floor(props.boxNumber / 3) * 3 + Math.floor(props.cellNumber / 3);
  const x = (props.boxNumber % 3) * 3 + (props.cellNumber % 3);

  return [y, x];
}
</script>

<template>
  <div
    class="cell"
    tabindex="0"
    @mousedown.exact="setSelected(coords)"
    @mousedown.shift="appendSelected(coords)"
    @mousedown.ctrl="appendSelected(coords)"
    @dblclick="selectAll(coords)"
  >
    <div :class="{ outline: true, selected: isSelected }">
      <div v-if="cell.value > 0" :class="cell.given ? 'given' : 'digit'">{{ cell.value }}</div>
      <div v-else-if="cell.pencilMarkType === 'side'" class="side-marks-wrapper">
        <div v-for="i in 9" :key="i" class="side-marks">
          <span v-show="cell.pencilMarks.includes(i)">
            {{ i }}
          </span>
        </div>
      </div>
      <div v-else-if="cell.pencilMarkType === 'center'" class="center-marks-wrapper">
        {{ cell.pencilMarks.join('') }}
      </div>
    </div>
  </div>
</template>

<style scoped>
.cell {
  --highlight-color: rgb(100, 141, 255);

  background: white;
  width: 40px;
  height: 40px;
  font-size: 0.7rem;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
}

.outline {
  width: 100%;
  height: 100%;
  border: 3px solid transparent;
}

.selected {
  border: 3px solid var(--highlight-color);
}

:is(.given, .digit) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  font-weight: bold;
}

.digit {
  color: var(--highlight-color);
}

.side-marks-wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
}

.side-marks {
  color: var(--highlight-color);
  font-size: 0.55rem;
  display: flex;
}

.side-marks:nth-child(3n + 2) {
  justify-content: center;
}

.side-marks:nth-child(n + 4):nth-child(-n + 6) {
  align-items: center;
}

.side-marks:nth-child(3n) {
  justify-content: end;
}

.side-marks:nth-child(n + 7) {
  align-items: end;
}

.side-marks:nth-child(5) {
  align-items: center;
  justify-content: center;
}

.center-marks-wrapper {
  display: flex;
  height: 100%;
  align-items: center;
  justify-content: center;
  font-size: v-bind(centerMarksSize);
  color: var(--highlight-color);
}
</style>
