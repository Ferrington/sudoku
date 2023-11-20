import { generateBoardFromString } from '@/utils/generateBoard';
import { eliminateCandidates } from '@/utils/hintMethods';
import { fail } from 'assert';
import { expect, test } from 'vitest';
import { ref } from 'vue';
import { boxLineReductionRefactor } from './boxLineReductionRefactor';
import { hiddenSingleRefactor } from './hiddenSingleRefactor';
import { nakedPairRefactor } from './nakedNRefactor';
import { nakedSingleRefactor } from './nakedSingleRefactor';

test('can eliminate candidates', () => {
  const puzzle = ref(
    generateBoardFromString(
      '000105000140000670080002400063070010900000003010090520007200080026000035000409000'
    )
  );
  eliminateCandidates(puzzle);

  expect(puzzle.value['0,0'].candidates).toEqual(new Set([2, 3, 6, 7]));
  expect(puzzle.value['0,7'].candidates).toEqual(new Set([9]));
  expect(puzzle.value['3,6'].candidates).toEqual(new Set([8, 9]));
});

test('can find naked single', () => {
  const puzzle = ref(
    generateBoardFromString(
      '000105000140000670080002400063070010900000003010090520007200080026000035000409000'
    )
  );

  eliminateCandidates(puzzle);
  const hint = nakedSingleRefactor(puzzle);
  if (hint == null) fail();
  expect(hint.primaryCells).toEqual(['0,7']);
  expect(hint.secondaryCells).toEqual([]);
});

test('can find hidden single', () => {
  const puzzle = ref(
    generateBoardFromString(
      '200070038000006070300040600008020700100000006007030400004080009060400000910060002'
    )
  );
  eliminateCandidates(puzzle);
  const hint = hiddenSingleRefactor(puzzle);
  if (hint == null) fail();
  expect(hint.primaryCells).toEqual(['0,1']);
  expect(hint.secondaryCells.sort()).toEqual(['0,2', '0,3', '0,5', '0,6'].sort());
});

test('can find naked pair', () => {
  const puzzle = ref(
    generateBoardFromString(
      '400000938032094100095300240370609004529001673604703090957008300003900400240030709'
    )
  );
  eliminateCandidates(puzzle);
  const hint = nakedPairRefactor(puzzle);
  if (hint == null) fail();
  expect(hint.primaryCells.sort()).toEqual(['0,1', '0,2'].sort());
  expect(hint.secondaryCells.sort()).toEqual(['1,0', '2,0', '0,3', '0,4', '0,5'].sort());
  expect(puzzle.value['0,4'].candidates).toEqual(new Set([2, 5, 7]));
  expect(puzzle.value['2,0'].candidates).toEqual(new Set([7, 8]));
});

test('box line reduction', () => {
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
