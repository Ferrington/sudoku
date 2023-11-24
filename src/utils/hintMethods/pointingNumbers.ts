import { REGION_DICT } from '@/constants';
import type { Cell, Coords, Hint, Region, SudokuGrid } from '@/types';
import { performCheck } from '@/utils/performCheck';
import { coordsToString, stringToCoords } from '@/utils/utils';
import type { Ref } from 'vue';

export function pointingNumbers(sudokuGrid: Ref<SudokuGrid>): Hint | null {
  let hint: Hint | null = null;

  function cellsForEachNumber(cells: Cell[]) {
    return cells.reduce(
      (result, cell) => {
        cell.candidates.forEach((n) => {
          if (n in result) result[n].push(stringToCoords(cell.coords));
          else result[n] = [stringToCoords(cell.coords)];
        });
        return result;
      },
      {} as Record<number, Coords[]>
    );
  }

  function allCellsInRowOrCol(numberCells: Record<number, Coords[]>) {
    return Object.entries(numberCells)
      .filter(([, coordsArr]) => {
        return (
          coordsArr.every(([y]) => y === coordsArr[0][0]) ||
          coordsArr.every(([, x]) => x === coordsArr[0][1])
        );
      })
      .map(([n, coordsArr]): [number, string[], Region] => {
        const direction = coordsArr[0][0] === coordsArr[1][0] ? 'row' : 'col';
        const coords = coordsArr.map(([y, x]) => coordsToString(y, x));
        return [Number(n), coords, direction];
      });
  }

  function removePencilMarks(pointingNumbers: [number, string[], Region][]) {
    for (const [n, coords, region] of pointingNumbers) {
      const missingPencilMarks = removePencilMarksFromRowOrCol(n, coords, region);

      if (missingPencilMarks) {
        addMissingPrimaryMarks(n, coords);
        hint = {
          primaryCells: coords,
          secondaryCells: REGION_DICT[coords[0]][region].filter((cell) => !coords.includes(cell)),
          incorrectCells: [],
          heading: 'Pointing Numbers',
          message: `${n} can only appear in a single ${
            region === 'col' ? 'column' : region
          } in this box. It can be eliminated from the rest of the ${
            region === 'col' ? 'column' : region
          }.`,
        };
        return true;
      }
    }

    return false;
  }

  function addMissingPrimaryMarks(n: number, coords: string[]) {
    coords.forEach((cellCoords) => {
      const cell = sudokuGrid.value[cellCoords];
      if (cell.pencilMarks.length === 0) cell.pencilMarkType = 'side';
      if (!cell.pencilMarks.includes(n)) cell.pencilMarks.push(n);
    });
  }

  function removePencilMarksFromRowOrCol(n: number, coords: string[], region: Region) {
    let missingPencilMarks = false;
    let eliminatedPencilMarks = false;
    let candidatesDeleted = false;
    REGION_DICT[coords[0]][region].forEach((cellCoords) => {
      const cell = sudokuGrid.value[cellCoords];

      if (coords.includes(cellCoords)) {
        if (!cell.pencilMarks.includes(n)) missingPencilMarks = true;
        return;
      }

      if (cell.candidates.delete(n)) {
        candidatesDeleted = true;
      }

      if (cell.pencilMarks.includes(n)) {
        eliminatedPencilMarks = true;
      }
    });

    return eliminatedPencilMarks || (candidatesDeleted && missingPencilMarks);
  }

  // loop over every box
  performCheck(sudokuGrid.value, false, (cells: Cell[], region: Region) => {
    if (region !== 'box') return false;

    /*  get list of cells for each number
        {
          1: ['0,0', '0,1'],
          2: ['0,0', '0,4', '0,5'],
          ...
        }
    */
    const numberCells = cellsForEachNumber(cells);

    // keep only numbers where all cells are in the same row / col
    // these are the targets of this solving method
    const pointingNumbers = allCellsInRowOrCol(numberCells);

    return removePencilMarks(pointingNumbers);
  });

  return hint;
}
