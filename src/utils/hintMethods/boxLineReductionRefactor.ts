import { REGION_DICT } from '@/constants';
import type { Cell, Hint, Region, SudokuGrid } from '@/types';
import { performCheck } from '@/utils/performCheck';
import type { Ref } from 'vue';

type CellsForNumber = Record<number, string[]>;

type CellsForNumberEntry = [number, string[]];

export function boxLineReductionRefactor(sudokuGrid: Ref<SudokuGrid>): Hint | null {
  let hint: Hint | null = null;

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

  function removePencilMarks(pointingNumbers: CellsForNumberEntry[]) {
    for (const [n, coords] of pointingNumbers) {
      const missingPencilMarks = removePencilMarksFromBox(n, coords);

      if (missingPencilMarks) {
        hint = {
          primaryCells: coords,
          secondaryCells: REGION_DICT[coords[0]].box.filter((cell) => !coords.includes(cell)),
          incorrectCells: [],
          message: `[Box Line Reduction] ${n} can only appear in a single row/column in this box. They can be eliminated from the rest of the box.`,
        };
        return true;
      }
    }
    return false;
  }

  function removePencilMarksFromBox(n: number, coords: string[]) {
    let missingPencilMarks = false;
    REGION_DICT[coords[0]].box.forEach((cellCoords) => {
      if (coords.includes(cellCoords)) return;

      const cell = sudokuGrid.value[cellCoords];
      cell.candidates.delete(n);

      if (cell.pencilMarks.includes(n)) {
        missingPencilMarks = true;
      }
    });

    return missingPencilMarks;
  }

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
    const pointingNumbers = allCellsInBox(numberCells);

    // if able to remove pencil marks, assign hint and short circuit
    return removePencilMarks(pointingNumbers);
  });

  return hint;
}
