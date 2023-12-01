import { generateBoardFromString } from '@/utils/generateBoard';
import { expect, test } from 'vitest';
import { solvePuzzle } from './solvePuzzle';

test('can solve puzzle', () => {
  const puzzle = generateBoardFromString(
    '000105000140000670080002400063070010900000003010090520007200080026000035000409000'
  );

  const solved = solvePuzzle(puzzle);
  expect(solved['0,0'].value).toBe(6);
  expect(solved['8,8'].value).toBe(7);
});

test('throws error on invalid puzzle', () => {
  const puzzle = generateBoardFromString(
    '100105000140000670080002400063070010900000003010090520007200080026000035000409000'
  );
  expect(() => solvePuzzle(puzzle)).toThrowError();
});
