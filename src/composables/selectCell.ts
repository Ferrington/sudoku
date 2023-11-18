import { useSudokuStore } from '@/stores/sudoku';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

export function useSelectCell(coordsString: string) {
  const sudokuStore = useSudokuStore();
  const { setSelected, appendSelected } = sudokuStore;
  const { selectedCells } = storeToRefs(sudokuStore);

  const isSelected = computed((): Boolean => {
    return selectedCells.value.some((cs) => cs === coordsString);
  });

  return {
    isSelected,
    setSelected,
    appendSelected,
  };
}
