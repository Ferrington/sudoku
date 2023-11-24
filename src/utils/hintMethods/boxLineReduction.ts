import { REGION_DICT } from '@/constants';
import type { Cell, CellsForNumber, CellsForNumberEntry, Hint, Region, SudokuGrid } from '@/types';
import { performCheck } from '@/utils/performCheck';
import type { Ref } from 'vue';

export function boxLineReduction(sudokuGrid: Ref<SudokuGrid>): Hint | null {
  function cellsForEachNumber(cells: Cell[]) {
    return cells.reduce((result, cell) => {
      cell.candidates.forEach((n) => {
        if (n in result) result[n].push(cell.coords);
        else result[n] = [cell.coords];
      });
      return result;
    }, {} as CellsForNumber);
  }

  function allCellsInBox(numberCells: CellsForNumber): CellsForNumberEntry[] {
    return Object.entries(numberCells)
      .filter(([, coordsArr]) => {
        return coordsArr.every((coords) => REGION_DICT[coordsArr[0]].box.includes(coords));
      })
      .map(([n, coordsArr]) => [Number(n), coordsArr]);
  }

  function removePencilMarks(boxNumbers: CellsForNumberEntry[]) {
    for (const [n, coords] of boxNumbers) {
      const missingPencilMarks = removePencilMarksFromBox(n, coords);

      if (missingPencilMarks) {
        addMissingPrimaryMarks(n, coords);
        hint = {
          primaryCells: coords,
          secondaryCells: REGION_DICT[coords[0]].box.filter((cell) => !coords.includes(cell)),
          incorrectCells: [],
          heading: 'Box Line Reduction',
          href: 'https://www.sudopedia.org/wiki/Locked_Candidates',
          message: `${n} can only appear in a single row/column in this box. It can be eliminated from the rest of the box.`,
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

  function removePencilMarksFromBox(n: number, coords: string[]) {
    let missingPencilMarks = false;
    let eliminatedPencilMarks = false;
    let candidatesDeleted = false;
    REGION_DICT[coords[0]].box.forEach((cellCoords) => {
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

  let hint: Hint | null = null;

  // loop over every row / column
  performCheck(sudokuGrid.value, false, (cells: Cell[], region: Region) => {
    if (region === 'box') return false;

    /*  get list of cells for each number
        {
          1: ['0,0', '0,1'],
          2: ['0,0', '0,4', '0,5'],
          ...
        }
    */
    const numberCells = cellsForEachNumber(cells);

    // keep only numbers where all cells are in the same box
    // these are the targets of this solving method
    const boxNumbers = allCellsInBox(numberCells);

    // if able to remove pencil marks, assign hint and short circuit
    return removePencilMarks(boxNumbers);
  });

  return hint;
}
