import type { Cell, Hint, SudokuGrid } from '@/types';
import type { Ref } from 'vue';

export function nakedSingle(sudokuGrid: Ref<SudokuGrid>): Hint | null {
  // loop through all cells
  for (const [coords, cell] of Object.entries(sudokuGrid.value)) {
    // if cell has a single candidate it's a naked single
    if (cell.value !== 0 || cell.candidates.size !== 1) continue;

    updateCell(cell);

    return {
      primaryCells: [coords],
      secondaryCells: [],
      incorrectCells: [],
      message: '[Naked Single] There is only one number that can be placed in this cell.',
    };
  }

  return null;
}

function updateCell(cell: Cell) {
  cell.value = cell.candidates.values().next().value;
  cell.pencilMarks = [];
  cell.candidates = new Set();
}
