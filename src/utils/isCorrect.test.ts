import { generateBoardFromString } from '@/utils/generateBoard';
import { expect, test } from 'vitest';
import { isCorrect } from './isCorrect';

test('correct board returns true', () => {
  const puzzle = generateBoardFromString(
    '735164928426978315198532674249381756387256149561749832852617493914823567673495281'
  );

  expect(isCorrect(puzzle)).toBe(true);
});

test('incorrect board returns false', () => {
  const puzzle = generateBoardFromString(
    '100105000140000670080002400063070010900000003010090520007200080026000035000409000'
  );

  expect(isCorrect(puzzle)).toBe(false);
});

test('correct board with solved board returns true', () => {
  const puzzle = generateBoardFromString(
    '730004928420078315198532670249381756387256149561749832852617493914823567673495281'
  );
  const solved = generateBoardFromString(
    '735164928426978315198532674249381756387256149561749832852617493914823567673495281'
  );

  expect(isCorrect(puzzle, solved)).toBe(true);
});

test('incorrect board with solved board returns false', () => {
  const puzzle = generateBoardFromString(
    '735164928426970015198532674249381756387256149561749832852617493914823567673495281'
  );
  const solved = generateBoardFromString(
    '775164928426978315198532674249381756387256149561749832852617493914823567673495281'
  );

  expect(isCorrect(puzzle, solved)).toBe(false);
});
