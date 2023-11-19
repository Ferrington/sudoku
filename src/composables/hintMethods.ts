import { REGION_DICT } from '@/constants';
import type { Cell, Hint, Region, SudokuGrid } from '@/types';
import { performCheck } from '@/utils/performCheck';
import { sameMembers } from '@/utils/utils';
import type { Ref } from 'vue';
// @ts-ignore
import comb from 'combinations-generator';

export function useHintMethods() {
  function eliminateCandidates(sudokuGrid: Ref<SudokuGrid>) {
    let eliminatedCandidates = false;
    let gridChanged = true;
    while (gridChanged) {
      gridChanged = false;
      Object.entries(sudokuGrid.value).forEach(([coordsString, cell]) => {
        if (cell.value === 0) return;
        Object.values(REGION_DICT[coordsString]).forEach((coordsStrings) => {
          coordsStrings.forEach((coords) => {
            if (!sudokuGrid.value[coords].candidates.has(cell.value)) return;
            sudokuGrid.value[coords].candidates.delete(cell.value);
            eliminatedCandidates = true;
            gridChanged = true;
          });
        });
      });
    }
    return eliminatedCandidates;
  }

  function nakedSingle(sudokuGrid: Ref<SudokuGrid>, hint: Ref<Hint>) {
    let placedCoords = false;
    Object.entries(sudokuGrid.value).some(([coords, cell]) => {
      if (cell.candidates.size !== 1 || cell.value !== 0) return false;
      hint.value = {
        primaryCells: [coords],
        secondaryCells: [],
        message: '[Naked Single] There is only one number that can be placed in this cell.',
      };
      placedCoords = true;
      return true;
    });
    return placedCoords;
  }

  function hiddenSingle(sudokuGrid: Ref<SudokuGrid>, hint: Ref<Hint>) {
    let foundSingle = false;
    performCheck(sudokuGrid.value, false, (cells: Cell[], region: Region) => {
      const counts = cells.reduce(
        (counts, cell) => {
          cell.candidates.forEach((n) => {
            if (n in counts) counts[n]++;
            else counts[n] = 1;
          });
          return counts;
        },
        {} as { [key: number]: number }
      );

      foundSingle = Object.entries(counts).some(([key, value]) => {
        if (value !== 1) return false;

        const cellWithSingle = cells.find((cell) => cell.candidates.has(Number(key)));
        hint.value = {
          primaryCells: [cellWithSingle!.coords],
          secondaryCells: cells
            .filter((cell) => cell.coords != cellWithSingle!.coords && cell.value === 0)
            .map((cell) => cell.coords),
          message: `[Hidden Single] This cell's value cannot be placed anywhere else in the ${region}.`,
        };
        return true;
      });
      return foundSingle;
    });

    return foundSingle;
  }

  function nakedPair(sudokuGrid: Ref<SudokuGrid>, hint: Ref<Hint>) {
    let foundPair = false;
    performCheck(sudokuGrid.value, false, (cells: Cell[]) => {
      const counts = cells.reduce(
        (counts, cell) => {
          const candidateString = Array.from(cell.candidates).sort().join('');
          if (candidateString.length !== 2) return counts;

          if (candidateString in counts) counts[candidateString]++;
          else counts[candidateString] = 1;
          return counts;
        },
        {} as { [key: string]: number }
      );

      foundPair = Object.entries(counts).some(([key, value]) => {
        if (value !== 2) return false;

        const cellsWithPair = cells.filter(
          (cell) => Array.from(cell.candidates).sort().join('') === key
        );
        if (cellsWithPair.every((cell) => cell.pencilMarks.sort().join('') === key)) return false;

        hint.value = {
          primaryCells: cellsWithPair.map((cell) => cell.coords),
          secondaryCells: [],
          message: `[Naked Double] These two cells form a naked double.`,
        };
        return true;
      });
      return foundPair;
    });

    return foundPair;
  }

  function nakedTriple(sudokuGrid: Ref<SudokuGrid>, hint: Ref<Hint>) {
    let foundTriple = false;
    performCheck(sudokuGrid.value, false, (cells: Cell[]) => {
      const candidateUnion = cells
        .map((cell) => [...cell.candidates])
        .reduce((result, candidates) => {
          return [...new Set([...result, ...candidates])];
        }, []);
      const allCombos = [...comb(candidateUnion, 3)];
      allCombos.some((combo) => {
        const matches = cells.filter(
          (cell) => cell.value === 0 && [...cell.candidates].every((n) => combo.includes(n))
        );

        if (
          matches.length < 3 ||
          matches.every((cell) => sameMembers(cell.pencilMarks, [...cell.candidates]))
        )
          return false;

        const matchCoords = matches.map((cell) => cell.coords);
        const secondaryCoords: string[] = [];
        Object.entries(REGION_DICT[matches[0].coords]).forEach(([region, coords]) => {
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

        // console.log(REGION_DICT[matches[0].coords]);
        // console.log(matches.map((cell) => cell.coords));

        hint.value = {
          primaryCells: matchCoords,
          secondaryCells: secondaryCoords,
          message: `[Naked Triple] These three cells form a naked triple. You can eliminate their values from the highlighted regions.`,
        };
        foundTriple = true;
        return true;
      });
      return foundTriple;
    });

    return foundTriple;
  }

  return {
    eliminateCandidates,
    nakedSingle,
    hiddenSingle,
    nakedPair,
    nakedTriple,
  };
}
