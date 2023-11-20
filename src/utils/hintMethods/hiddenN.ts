import type { Cell, Hint, SudokuGrid } from '@/types';
import { performCheck } from '@/utils/performCheck';
import { sameMembers } from '@/utils/utils';
import type { Ref } from 'vue';
// @ts-ignore
import comb from 'combinations-generator';

export function hiddenPair(sudokuGrid: Ref<SudokuGrid>, hint: Ref<Hint>) {
  return hiddenN(sudokuGrid, hint, 2);
}

export function hiddenTriple(sudokuGrid: Ref<SudokuGrid>, hint: Ref<Hint>) {
  return hiddenN(sudokuGrid, hint, 3);
}

function hiddenN(sudokuGrid: Ref<SudokuGrid>, hint: Ref<Hint>, n: number) {
  let foundTriple = false;
  performCheck(sudokuGrid.value, false, (cells: Cell[]) => {
    const candidateUnion = cells
      .map((cell) => [...cell.candidates])
      .reduce((result, candidates) => {
        return [...new Set([...result, ...candidates])];
      }, []);
    const allCombos = [...comb(candidateUnion, n)];
    allCombos.some((combo) => {
      const matches = cells.filter(
        (cell) => cell.value === 0 && [...cell.candidates].some((n) => combo.includes(n))
      );

      if (matches.length != n) return false;

      const matchCoords = matches.map((cell) => cell.coords);
      matches.forEach((cell) => {
        cell.candidates.forEach((n) => {
          if (!combo.includes(n)) cell.candidates.delete(n);
        });
      });

      if (matches.every((cell) => sameMembers(cell.pencilMarks, [...cell.candidates]))) {
        return true;
      } else {
        matches.forEach((cell) => {
          cell.pencilMarkType = 'center';
          cell.pencilMarks = [...cell.candidates];
        });
      }

      const methodName = n === 2 ? 'Hidden Pair' : 'Hidden Triple';

      hint.value = {
        primaryCells: matchCoords,
        secondaryCells: [],
        incorrectCells: [],
        message: `[${methodName}] These cells form a ${methodName.toLowerCase()}.`,
      };
      foundTriple = true;
      return true;
    });
    return foundTriple;
  });

  return foundTriple;
}
