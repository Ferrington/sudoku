import { generateBoardFromString } from '@/utils/generateBoard';
import { eliminateCandidates } from '@/utils/hintMethods';
import { fail } from 'assert';
import { expect, test } from 'vitest';
import { ref } from 'vue';
import { boxLineReductionRefactor } from './boxLineReductionRefactor';

test('box line reduction refactor', () => {
  const puzzle = ref(
    generateBoardFromString(
      '016007803092800000870001260048000300650009082039000650060900020080002936924600510'
    )
  );

  puzzle.value['1,6'].pencilMarks = [1, 2, 3, 4, 5, 6, 7, 8, 9];

  eliminateCandidates(puzzle);
  const hint = boxLineReductionRefactor(puzzle);
  if (hint == null) fail();
  expect(hint.primaryCells.sort()).toEqual(['0,7', '1,7'].sort());
  expect(hint.secondaryCells.sort()).toEqual(
    ['0,6', '1,6', '2,6', '2,8', '0,8', '1,8', '2,7'].sort()
  );
  expect(puzzle.value['1,6'].candidates).toEqual(new Set([1, 7]));
  expect(puzzle.value['2,8'].candidates).toEqual(new Set([5, 9]));
});
