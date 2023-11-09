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
    grid[`${y},${x}`] = {
      value: isNaN(cellValue) ? 0 : cellValue,
      given: !isNaN(cellValue),
      pencilMarks: [],
      pencilMarkType: 'center',
    };
  });

  return grid;
}
