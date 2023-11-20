import type { Cell, Hint, SudokuGrid } from '@/types';
import type { Ref } from 'vue';

export function nakedSingle(sudokuGrid: Ref<SudokuGrid>, hint: Ref<Hint>) {
  let placedSingle = false;
  Object.entries(sudokuGrid.value).some(([coords, cell]) => {
    if (cell.value !== 0 || cell.candidates.size !== 1) return false;

    updateCell(cell);

    hint.value = {
      primaryCells: [coords],
      secondaryCells: [],
      incorrectCells: [],
      message: '[Naked Single] There is only one number that can be placed in this cell.',
    };

    placedSingle = true;
    return true;
  });
  return placedSingle;
}

function updateCell(cell: Cell) {
  cell.value = cell.candidates.values().next().value;
  cell.pencilMarks = [];
  cell.candidates = new Set();
}
