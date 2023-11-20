import { REGION_DICT } from '@/constants';
import type { Cell, Hint, Region, SudokuGrid } from '@/types';
import { performCheck } from '@/utils/performCheck';
import type { Ref } from 'vue';

export function boxLineReduction(sudokuGrid: Ref<SudokuGrid>, hint: Ref<Hint>) {
  let foundPointing = false;
  performCheck(sudokuGrid.value, false, (cells: Cell[], region: Region) => {
    if (region === 'box') return false;

    const numberCells = cells.reduce(
      (result, cell) => {
        cell.candidates.forEach((n) => {
          if (n in result) result[n].push(cell.coords);
          else result[n] = [cell.coords];
        });
        return result;
      },
      {} as Record<number, string[]>
    );

    const pointingNumbers = Object.entries(numberCells)
      .filter(([, coordsArr]) => {
        return coordsArr.every((y) => REGION_DICT[coordsArr[0]].box.includes(y));
      })
      .map(([n, coordsArr]): [number, string[], Region] => {
        const direction = 'box';
        return [Number(n), coordsArr, direction];
      });

    console.log(pointingNumbers);

    pointingNumbers.some(([n, coords, region]) => {
      let missingPencilMarks = false;
      REGION_DICT[coords[0]][region].forEach((cellCoords) => {
        if (coords.includes(cellCoords)) return;

        const cell = sudokuGrid.value[cellCoords];
        cell.candidates.delete(n);

        if (cell.pencilMarks.includes(n)) {
          missingPencilMarks = true;
        }
      });

      if (missingPencilMarks) {
        foundPointing = true;
        hint.value = {
          primaryCells: coords,
          secondaryCells: REGION_DICT[coords[0]][region].filter((cell) => !coords.includes(cell)),
          incorrectCells: [],
          message: `[Box Line Reduction] ${n} can only appear in a single row/column in this box. They can be eliminated from the rest of the ${region}.`,
        };
      }

      return missingPencilMarks;
    });

    return foundPointing;
  });

  return foundPointing;
}
