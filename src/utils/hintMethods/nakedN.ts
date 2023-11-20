import { REGION_DICT } from '@/constants';
import type { Cell, Hint, SudokuGrid } from '@/types';
import { performCheck } from '@/utils/performCheck';
import { sameMembers } from '@/utils/utils';
import type { Ref } from 'vue';
// @ts-ignore
import comb from 'combinations-generator';

export function nakedPair(sudokuGrid: Ref<SudokuGrid>, hint: Ref<Hint>) {
  return nakedN(sudokuGrid, hint, 2);
}

export function nakedTriple(sudokuGrid: Ref<SudokuGrid>, hint: Ref<Hint>) {
  return nakedN(sudokuGrid, hint, 3);
}

function nakedN(sudokuGrid: Ref<SudokuGrid>, hint: Ref<Hint>, n: number) {
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
        (cell) => cell.value === 0 && [...cell.candidates].every((n) => combo.includes(n))
      );

      if (matches.length < n) return false;

      const matchCoords = matches.map((cell) => cell.coords);
      const secondaryCoords: string[] = [];
      Object.entries(REGION_DICT[matches[0].coords]).forEach(([, coords]) => {
        if (matchCoords.every((coord) => coords.includes(coord))) {
          coords.forEach((coord) => {
            const cell = sudokuGrid.value[coord];
            if (cell.value !== 0 || matchCoords.includes(coord)) return;
            combo.forEach((n: number) => {
              cell.candidates.delete(n);
            });
            secondaryCoords.push(coord);
          });
        }
      });

      if (matches.every((cell) => sameMembers(cell.pencilMarks, [...cell.candidates]))) {
        return true;
      } else {
        matches.forEach((cell) => {
          cell.pencilMarkType = 'center';
          cell.pencilMarks = [...cell.candidates];
        });
      }

      const methodName = n === 2 ? 'Naked Pair' : 'Naked Triple';

      hint.value = {
        primaryCells: matchCoords,
        secondaryCells: secondaryCoords,
        incorrectCells: [],
        message: `[${methodName}] These cells form a ${methodName.toLowerCase()}. You can eliminate their values from the highlighted regions.`,
      };
      foundTriple = true;
      return true;
    });
    return foundTriple;
  });

  return foundTriple;
}
