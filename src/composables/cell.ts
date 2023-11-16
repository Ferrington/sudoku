import { useSelectCell } from '@/composables/selectCell';
import { useHintStore } from '@/stores/hint';
import { useSudokuGridStore } from '@/stores/sudokuGrid';
import type { Cell } from '@/types';
import { coordsToString } from '@/utils/utils';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

export function useCell(boxNumber: number, cellNumber: number) {
  const sudokuStore = useSudokuGridStore();
  const { performCheckFromCell, selectAllWithValue } = sudokuStore;
  const { sudokuGrid } = storeToRefs(sudokuStore);
  const hintStore = useHintStore();
  const { hint } = storeToRefs(hintStore);

  const coordsString = computed((): string => getCoordsString());
  const { isSelected, setSelected, appendSelected } = useSelectCell(coordsString.value);

  const cell = computed((): Cell => {
    return sudokuGrid.value[coordsString.value];
  });

  const isConflicting = computed((): Boolean => {
    return (
      performCheckFromCell(coordsString.value, false, (cells: Cell[]) => {
        const values = cells.map((cell) => cell.value).filter((val) => val !== 0);
        return values.indexOf(cell.value.value) === values.lastIndexOf(cell.value.value);
      }) && !cell.value.given
    );
  });

  const centerMarksSize = computed(() => {
    const charCount = cell.value.pencilMarks.length;
    const fontSize = 1.2 - 0.15 * Math.max(charCount - 5, 0);
    return fontSize + 'rem';
  });

  function getCoordsString(): string {
    const y = Math.floor(boxNumber / 3) * 3 + Math.floor(cellNumber / 3);
    const x = (boxNumber % 3) * 3 + (cellNumber % 3);

    return coordsToString(y, x);
  }

  const isPrimaryHint = computed(() => hint.value.primaryCell === coordsString.value);
  const isSecondaryHint = computed(() => hint.value.secondaryCells.includes(coordsString.value));

  return {
    cell,
    isConflicting,
    isSelected,
    centerMarksSize,
    isPrimaryHint,
    isSecondaryHint,
    setSelected: () => setSelected(coordsString.value),
    appendSelected: () => appendSelected(coordsString.value),
    selectAllWithValue: () => selectAllWithValue(cell.value.value),
  };
}
