import type { Cell, SudokuGrid } from '@/types';
import { performCheck } from './performCheck';

export function isCorrect(sudokuGrid: SudokuGrid, solvedGrid: SudokuGrid | undefined = undefined) {
  if (solvedGrid != null) {
    return isCorrectShort(sudokuGrid, solvedGrid);
  }
  return isCorrectLong(sudokuGrid);
}

export function isCorrectShort(sudokuGrid: SudokuGrid, solvedGrid: SudokuGrid) {
  return Object.entries(solvedGrid).reduce((bool, [coordsString, solvedCell]) => {
    const cellValue = sudokuGrid[coordsString].value;
    if (cellValue !== 0 && cellValue !== solvedCell.value) return false;
    return bool;
  }, true);
}

export function isCorrectLong(sudokuGrid: SudokuGrid) {
  return performCheck(sudokuGrid, true, (cells: Cell[]) => {
    const values = [];
    const uniqueValues = new Set();
    for (const cell of cells) {
      if (cell.value === 0) continue;
      values.push(cell.value);
      uniqueValues.add(cell.value);
    }
    return uniqueValues.size === values.length;
  });
}
