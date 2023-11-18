import { REGION_DICT } from '@/constants';
import type { Cell, SudokuGrid } from '@/types';

export function performCheck(grid: SudokuGrid, checkAll: boolean, check: Function) {
  /*
    loop through unique regions

    0 . . . . . . . .
    . . . 1 . . . . .
    . . . . . . 2 . .
    . 3 . . . . . . .
    . . . . 4 . . . .
    . . . . . . . 5 .
    . . 6 . . . . . . 
    . . . . . 7 . . .
    . . . . . . . . 8

  */
  const cellCoords = ['0,0', '1,3', '2,6', '3,1', '4,4', '5,7', '6,2', '7,5', '8,8'];
  const runCheck = (coords: string) => performCheckFromCell(grid, coords, checkAll, check);
  if (checkAll) {
    return cellCoords.every(runCheck);
  } else {
    return cellCoords.some(runCheck);
  }
}

export function performCheckFromCell(
  grid: SudokuGrid,
  coordsString: string,
  checkAll: boolean,
  check: Function
) {
  const entries = Object.entries(REGION_DICT[coordsString]);
  const runCheck = ([region, coordStrings]: [string, string[]]) => {
    const cells: Cell[] = coordStrings.map((coords) => grid[coords]);
    return check(cells, region);
  };
  if (checkAll) {
    return entries.every(runCheck);
  } else {
    return entries.some(runCheck);
  }
}
