import type { SudokuGrid } from '@/types';
import type { Ref } from 'vue';

export function isComplete(sudokuGrid: Ref<SudokuGrid>) {
  return !Object.values(sudokuGrid.value).some((cell) => cell.value === 0);
}
