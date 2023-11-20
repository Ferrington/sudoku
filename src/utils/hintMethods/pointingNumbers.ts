import { REGION_DICT } from '@/constants';
import type { Cell, Coords, Hint, Region, SudokuGrid } from '@/types';
import { performCheck } from '@/utils/performCheck';
import { coordsToString, stringToCoords } from '@/utils/utils';
import type { Ref } from 'vue';

export function pointingNumbers(sudokuGrid: Ref<SudokuGrid>, hint: Ref<Hint>) {
  let foundPointing = false;
  performCheck(sudokuGrid.value, false, (cells: Cell[], region: Region) => {
    if (region !== 'box') return false;

    const numberCells = cells.reduce(
      (result, cell) => {
        cell.candidates.forEach((n) => {
          if (n in result) result[n].push(stringToCoords(cell.coords));
          else result[n] = [stringToCoords(cell.coords)];
        });
        return result;
      },
      {} as { [key: number]: Coords[] }
    );

    const pointingNumbers = Object.entries(numberCells)
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
          message: `[Pointing Numbers] ${n} can only appear in a single ${region} in this box. They can be eliminated from the rest of the ${region}`,
        };
      }

      return missingPencilMarks;
    });

    return foundPointing;
  });

  return foundPointing;
}
