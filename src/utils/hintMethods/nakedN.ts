import { REGION_DICT } from '@/constants';
import type { Cell, Hint, SudokuGrid } from '@/types';
import { performCheck } from '@/utils/performCheck';
import { sameMembers } from '@/utils/utils';
import type { Ref } from 'vue';
// @ts-ignore
import comb from 'combinations-generator';

export function nakedPair(sudokuGrid: Ref<SudokuGrid>): Hint | null {
  return nakedN(sudokuGrid, 2);
}

export function nakedTriple(sudokuGrid: Ref<SudokuGrid>): Hint | null {
  return nakedN(sudokuGrid, 3);
}

function nakedN(sudokuGrid: Ref<SudokuGrid>, n: number): Hint | null {
  function findAllCandidates(cells: Cell[]) {
    return cells
      .map((cell) => [...cell.candidates])
      .reduce((result, candidates) => {
        return [...new Set([...result, ...candidates])];
      }, []);
  }

  function findSecondaryCoords(matchCoords: string[], matches: Cell[]) {
    const secondaryCoords: string[] = [];

    for (const coords of Object.values(REGION_DICT[matches[0].coords])) {
      if (!matchCoords.every((coord) => coords.includes(coord))) continue;

      const coordsToAdd = coords.filter((coord) => {
        const cell = sudokuGrid.value[coord];
        return cell.value === 0 && !matchCoords.includes(coord);
      });
      secondaryCoords.push(...coordsToAdd);
    }

    return secondaryCoords;
  }

  function eliminateCandidates(coords: string[], combo: number[]) {
    coords.forEach((coord) => {
      const cell = sudokuGrid.value[coord];
      combo.forEach((n: number) => {
        cell.candidates.delete(n);
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
      // find all cells whose candidates are all in the combo
      const matches = cells.filter(
        (cell) => cell.value === 0 && [...cell.candidates].every((n) => combo.includes(n))
      );

      // if there are n or greater matches, we've found a nakedN
      if (matches.length < n) continue;

      const matchCoords = matches.map((cell) => cell.coords);
      const secondaryCoords = findSecondaryCoords(matchCoords, matches);
      eliminateCandidates(secondaryCoords, combo);

      // if pencil marks already reflect candidates we don't need to hint
      if (matches.every((cell) => sameMembers(cell.pencilMarks, [...cell.candidates]))) continue;

      makePencilMarks(matches);

      const methodName = n === 2 ? 'Naked Pair' : 'Naked Triple';
      const methodHref =
        n === 2
          ? 'https://www.sudopedia.org/wiki/Naked_Pair'
          : 'https://www.sudopedia.org/wiki/Naked_Triple';
      hint = {
        primaryCells: matchCoords,
        secondaryCells: secondaryCoords,
        incorrectCells: [],
        heading: methodName,
        href: methodHref,
        message: `These cells form a ${methodName.toLowerCase()}. You can eliminate their values from the highlighted regions.`,
      };
      return true;
    }
  });

  return hint;
}
