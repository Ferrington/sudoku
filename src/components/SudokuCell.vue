<script setup lang="ts">
import { useSelectedStore } from '@/stores/selected';
import { useSudokuGridStore } from '@/stores/sudokuGrid';
import type { Cell } from '@/types';
import { coordsToString } from '@/utils/utils';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

const sudokuStore = useSudokuGridStore();
const { performCheckFromCell, selectAllWithValue } = sudokuStore;
const { sudokuGrid } = storeToRefs(sudokuStore);
const selectedStore = useSelectedStore();
const { setSelected, appendSelected } = selectedStore;
const { selectedCells } = storeToRefs(selectedStore);

const props = defineProps(['boxNumber', 'cellNumber']);
const coordsString = computed((): string => getCoordsString());
const isSelected = computed((): Boolean => {
  return selectedCells.value.some((cs) => cs === coordsString.value);
});
const cell = computed((): Cell => {
  return sudokuGrid.value[coordsString.value];
});
const isConflicting = computed((): Boolean => {
  return performCheckFromCell(coordsString.value, false, (cells: Cell[]) => {
    const values = cells.map((cell) => cell.value).filter((val) => val !== 0);
    return values.indexOf(cell.value.value) === values.lastIndexOf(cell.value.value);
  });
});
const centerMarksSize = computed(() => {
  const charCount = cell.value.pencilMarks.length;
  const fontSize = 1.2 - 0.15 * Math.max(charCount - 5, 0);
  return fontSize + 'rem';
});

function getCoordsString(): string {
  const y = Math.floor(props.boxNumber / 3) * 3 + Math.floor(props.cellNumber / 3);
  const x = (props.boxNumber % 3) * 3 + (props.cellNumber % 3);

  return coordsToString(y, x);
}
</script>

<template>
  <div
    :class="{ cell: true, conflicting: isConflicting && !cell.given }"
    tabindex="0"
    @mousedown.exact="setSelected(coordsString)"
    @mousedown.shift="appendSelected(coordsString)"
    @mousedown.ctrl="appendSelected(coordsString)"
    @dblclick="selectAllWithValue(cell.value)"
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
  width: 70px;
  height: 70px;
  font-size: 0.7rem;
  cursor: pointer;
  font-family: Arial, Helvetica, sans-serif;
}

.conflicting :is(.given, .digit) {
  color: red;
}

.outline {
  width: 100%;
  height: 100%;
  border: 4px solid transparent;
}

.selected {
  border: 4px solid var(--highlight-color);
}

:is(.given, .digit) {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: bold;
}

.digit {
  color: var(--highlight-color);
}

.side-marks-wrapper {
  height: 100%;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: repeat(3, 1fr);
}

.side-marks {
  color: var(--highlight-color);
  font-size: 0.9rem;
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
