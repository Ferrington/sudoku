import type { Cell, Hint, Region, SudokuGrid } from '@/types';
import { performCheck } from '@/utils/performCheck';
import type { Ref } from 'vue';

export function hiddenSingle(sudokuGrid: Ref<SudokuGrid>, hint: Ref<Hint>) {
  let foundSingle = false;
  performCheck(sudokuGrid.value, false, (cells: Cell[], region: Region) => {
    foundSingle = foundHiddenSingle(hint, cells, region);
    return foundSingle;
  });

  return foundSingle;
}

function foundHiddenSingle(hint: Ref<Hint>, cells: Cell[], region: Region) {
  const counts = cells.reduce(countOccurrences, {} as Record<number, number>);

  return Object.entries(counts).some(([key, value]) => {
    if (value !== 1) return false;

    const cellWithSingle = cells.find((cell) => cell.candidates.has(Number(key)));
    if (cellWithSingle == null) return false;

    updateCell(cellWithSingle, Number(key));
    hint.value = {
      primaryCells: [cellWithSingle.coords],
      secondaryCells: cells
        .filter((cell) => cell.coords != cellWithSingle!.coords && cell.value === 0)
        .map((cell) => cell.coords),
      incorrectCells: [],
      message: `[Hidden Single] This cell's value cannot be placed anywhere else in the ${region}.`,
    };
    return true;
  });
}

function countOccurrences(result: Record<number, number>, cell: Cell) {
  cell.candidates.forEach((n) => {
    if (n in result) result[n]++;
    else result[n] = 1;
  });
  return result;
}

function updateCell(cell: Cell, value: number) {
  cell.value = value;
  cell.pencilMarks = [];
  cell.candidates = new Set();
}
