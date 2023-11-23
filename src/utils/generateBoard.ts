import { BOARD_SIZE } from '@/constants';
import type { SudokuGrid } from '@/types';

// '35--1---2----5--8171--94---4-72--5-65-146-2---6-9-5--------73-5--4-298---7513892-';
export function generateBoardFromString(boardString: string): SudokuGrid {
  if (boardString.length !== BOARD_SIZE ** 2) {
    throw new Error('Invalid board string.');
  }

  const grid: SudokuGrid = {};
  [...boardString].forEach((n, i) => {
    const y = Math.floor(i / BOARD_SIZE);
    const x = i % BOARD_SIZE;
    const cellValue = Number(n);
    const isGiven = !isNaN(cellValue) && cellValue > 0;
    const coords = `${y},${x}`;
    grid[coords] = {
      coords,
      value: isGiven ? cellValue : 0,
      given: isGiven,
      pencilMarks: [],
      pencilMarkType: 'center',
      candidates: new Set(isGiven ? [] : [1, 2, 3, 4, 5, 6, 7, 8, 9]),
    };
  });

  return grid;
}
