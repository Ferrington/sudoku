import type { Cell, Hint, SudokuGrid } from '@/types';
import { performCheck } from '@/utils/performCheck';
import { sameMembers } from '@/utils/utils';
import type { Ref } from 'vue';
// @ts-ignore
import comb from 'combinations-generator';

export function hiddenPairRefactor(sudokuGrid: Ref<SudokuGrid>): Hint | null {
  return hiddenN(sudokuGrid, 2);
}

export function hiddenTripleRefactor(sudokuGrid: Ref<SudokuGrid>): Hint | null {
  return hiddenN(sudokuGrid, 3);
}

function hiddenN(sudokuGrid: Ref<SudokuGrid>, n: number): Hint | null {
  function findAllCandidates(cells: Cell[]) {
    return cells
      .map((cell) => [...cell.candidates])
      .reduce((result, candidates) => {
        return [...new Set([...result, ...candidates])];
      }, []);
  }

  function eliminateCandidates(matches: Cell[], combo: number[]) {
    matches.forEach((cell) => {
      cell.candidates.forEach((n) => {
        if (!combo.includes(n)) cell.candidates.delete(n);
      });
    });
  }

  function makePencilMarks(matches: Cell[]) {
    matches.forEach((cell) => {
      cell.pencilMarkType = 'center';
      cell.pencilMarks = [...cell.candidates];
    });
  }

  let hint = null;
  performCheck(sudokuGrid.value, false, (cells: Cell[]) => {
    // get set of all candidates
    const allCandidates = findAllCandidates(cells);

    /* generate combos of size n for all candidates. 
      Ex:
        n = 2
        Candidates = (1, 4, 6)
        Combos = [[1, 4], [1, 6], [4, 6]]
    */
    const allCombos = [...comb(allCandidates, n)];

    for (const combo of allCombos) {
      // find all cells with at least one candidate in the combo
      const matches = cells.filter(
        (cell) => cell.value === 0 && [...cell.candidates].some((n) => combo.includes(n))
      );

      // if there are n matches, we've found a hiddenN
      if (matches.length !== n) continue;

      const matchCoords = matches.map((cell) => cell.coords);
      eliminateCandidates(matches, combo);

      // if pencil marks already reflect candidates we don't need to hint
      if (matches.every((cell) => sameMembers(cell.pencilMarks, [...cell.candidates]))) continue;

      makePencilMarks(matches);

      const methodName = n === 2 ? 'Hidden Pair' : 'Hidden Triple';
      hint = {
        primaryCells: matchCoords,
        secondaryCells: [],
        incorrectCells: [],
        message: `[${methodName}] These cells form a ${methodName.toLowerCase()}.`,
      };
      return true;
    }
  });

  return hint;
}
