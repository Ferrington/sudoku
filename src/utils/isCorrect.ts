import type { SudokuGrid } from '@/types';
import type { Ref } from 'vue';

export function isCorrect(sudokuGrid: Ref<SudokuGrid>, solvedGrid: Ref<SudokuGrid>) {
  return Object.entries(solvedGrid.value).reduce((bool, [coordsString, solvedCell]) => {
    const cellValue = sudokuGrid.value[coordsString].value;
    if (cellValue !== 0 && cellValue !== solvedCell.value) return false;
    return bool;
  }, true);
}
