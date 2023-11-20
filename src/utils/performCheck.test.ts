import type { Cell } from '@/types';
import { generateBoardFromString } from '@/utils/generateBoard';
import { performCheck, performCheckFromCell } from '@/utils/performCheck';
import { expect, test } from 'vitest';

test('correct board returns true', () => {
  const puzzle = generateBoardFromString(
    '735164928426978315198532674249381756387256149561749832852617493914823567673495281'
  );

  expect(
    performCheck(puzzle, true, (cells: Cell[]) => {
      const values = cells.map((cell) => cell.value).filter((val) => val !== 0);
      return values.length === new Set(values).size;
    })
  ).toBe(true);
});

test('incorrect board returns false', () => {
  const puzzle = generateBoardFromString(
    '335164928426978315198532674249381756387256149561749832852617493914823567673495281'
  );

  expect(
    performCheck(puzzle, true, (cells: Cell[]) => {
      const values = cells.map((cell) => cell.value).filter((val) => val !== 0);
      return values.length === new Set(values).size;
    })
  ).toBe(false);
});

test('!checkAll works', () => {
  const puzzle = generateBoardFromString(
    '735164928020978315098532674249381756387256149561749832852617493914823567673495281'
  );

  expect(
    performCheck(puzzle, false, (cells: Cell[]) => {
      const values = cells.map((cell) => cell.value).filter((val) => val !== 0);
      return values.length === new Set(values).size;
    })
  ).toBe(true);
});

test('can detect conflicting cell value', () => {
  const coordsString = '0,1';
  let puzzle = generateBoardFromString(
    '775164928020978315098532674249381756387256149561749832852617493914823567673495281'
  );
  const cell = puzzle[coordsString];

  expect(
    performCheckFromCell(puzzle, coordsString, false, (cells: Cell[]) => {
      const values = cells.map((cell) => cell.value).filter((val) => val !== 0);
      return values.indexOf(cell.value) !== values.lastIndexOf(cell.value);
    })
  ).toBe(true);

  puzzle = generateBoardFromString(
    '735164928020978315098532674249381756387256149561749832852617493914823567673495281'
  );

  expect(
    performCheckFromCell(puzzle, coordsString, false, (cells: Cell[]) => {
      const values = cells.map((cell) => cell.value).filter((val) => val !== 0);
      return values.indexOf(cell.value) !== values.lastIndexOf(cell.value);
    })
  ).toBe(false);
});
