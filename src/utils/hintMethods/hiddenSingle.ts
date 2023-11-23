import type { Cell, Hint, Region, SudokuGrid } from '@/types';
import { performCheck } from '@/utils/performCheck';
import type { Ref } from 'vue';

export function hiddenSingle(sudokuGrid: Ref<SudokuGrid>): Hint | null {
  function findHiddenSingle(cells: Cell[], region: Region): Hint | null {
    // get counts of occurrences of all numbers
    const counts = countOccurrences(cells);

    // any number with a single occurrence is a hidden single
    for (const [key, value] of Object.entries(counts)) {
      if (value !== 1) continue;

      const cellWithSingle = cells.find((cell) => cell.candidates.has(Number(key)));
      if (cellWithSingle == null) continue;

      updateCell(cellWithSingle, Number(key));

      return {
        primaryCells: [cellWithSingle.coords],
        secondaryCells: cells
          .filter((cell) => cell.coords != cellWithSingle!.coords && cell.value === 0)
          .map((cell) => cell.coords),
        incorrectCells: [],
        message: `[Hidden Single] This cell's value cannot be placed anywhere else in the ${region}.`,
      };
    }

    return null;
  }

  function countOccurrences(cells: Cell[]) {
    return cells.reduce(
      (result, cell) => {
        cell.candidates.forEach((n) => {
          if (n in result) result[n]++;
          else result[n] = 1;
        });
        return result;
      },
      {} as Record<number, number>
    );
  }

  function updateCell(cell: Cell, value: number) {
    cell.value = value;
    cell.pencilMarks = [];
    cell.candidates = new Set();
  }

  let hint = null;
  performCheck(sudokuGrid.value, false, (cells: Cell[], region: Region) => {
    hint = findHiddenSingle(cells, region);
    return hint != null;
  });
  return hint;
}
