import type { Hint } from '@/types';
import { generateBoardFromString } from '@/utils/generateBoard';
import {
  eliminateCandidates,
  hiddenPair,
  hiddenSingle,
  hiddenTriple,
  nakedPair,
  nakedSingle,
  nakedTriple,
  pointingNumbers,
} from '@/utils/hintMethods';
import { expect, test } from 'vitest';
import { ref } from 'vue';

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
  const hint = ref<Hint>({
    primaryCells: [],
    secondaryCells: [],
    incorrectCells: [],
    message: '',
  });
  eliminateCandidates(puzzle);
  nakedSingle(puzzle, hint);

  expect(hint.value.primaryCells).toEqual(['0,7']);
  expect(hint.value.secondaryCells).toEqual([]);
});

test('can find hidden single', () => {
  const puzzle = ref(
    generateBoardFromString(
      '200070038000006070300040600008020700100000006007030400004080009060400000910060002'
    )
  );
  const hint = ref<Hint>({
    primaryCells: [],
    secondaryCells: [],
    incorrectCells: [],
    message: '',
  });
  eliminateCandidates(puzzle);
  hiddenSingle(puzzle, hint);

  expect(hint.value.primaryCells).toEqual(['0,1']);
  expect(hint.value.secondaryCells.sort()).toEqual(['0,2', '0,3', '0,5', '0,6'].sort());
});

test('can find naked pair', () => {
  const puzzle = ref(
    generateBoardFromString(
      '400000938032094100095300240370609004529001673604703090957008300003900400240030709'
    )
  );
  const hint = ref<Hint>({
    primaryCells: [],
    secondaryCells: [],
    incorrectCells: [],
    message: '',
  });
  eliminateCandidates(puzzle);
  nakedPair(puzzle, hint);

  expect(hint.value.primaryCells.sort()).toEqual(['0,1', '0,2'].sort());
  expect(hint.value.secondaryCells.sort()).toEqual(['1,0', '2,0', '0,3', '0,4', '0,5'].sort());
  expect(puzzle.value['0,4'].candidates).toEqual(new Set([2, 5, 7]));
  expect(puzzle.value['2,0'].candidates).toEqual(new Set([7, 8]));
});

test('can find naked triple', () => {
  const puzzle = ref(
    generateBoardFromString(
      '294513006600842319300697254000056000040080060000470000730164005900735001400928637'
    )
  );
  const hint = ref<Hint>({
    primaryCells: [],
    secondaryCells: [],
    incorrectCells: [],
    message: '',
  });
  eliminateCandidates(puzzle);
  nakedTriple(puzzle, hint);

  expect(hint.value.primaryCells.sort()).toEqual(['3,0', '4,0', '5,0'].sort());
  expect(hint.value.secondaryCells.sort()).toEqual(['3,1', '3,2', '4,2', '5,1', '5,2'].sort());
  expect(puzzle.value['3,2'].candidates).toEqual(new Set([2, 3, 7, 9]));
});

test('can find hidden pair', () => {
  const puzzle = ref(
    generateBoardFromString(
      '000000000904607000076804100309701080708000301051308702007502610005403208000000000'
    )
  );
  const hint = ref<Hint>({
    primaryCells: [],
    secondaryCells: [],
    incorrectCells: [],
    message: '',
  });
  eliminateCandidates(puzzle);
  hiddenPair(puzzle, hint);

  expect(hint.value.primaryCells.sort()).toEqual(['0,7', '0,8'].sort());
  expect(hint.value.secondaryCells).toEqual([]);
  expect(puzzle.value['0,7'].candidates).toEqual(new Set([6, 7]));
  expect(puzzle.value['0,8'].candidates).toEqual(new Set([6, 7]));
});

test('can find hidden triple', () => {
  const puzzle = ref(
    generateBoardFromString(
      '000001030231090000065003100678924300103050006000136700009360570006019843300000000'
    )
  );
  const hint = ref<Hint>({
    primaryCells: [],
    secondaryCells: [],
    incorrectCells: [],
    message: '',
  });
  eliminateCandidates(puzzle);
  hiddenTriple(puzzle, hint);

  expect(hint.value.primaryCells.sort()).toEqual(['0,3', '0,6', '0,8'].sort());
  expect(hint.value.secondaryCells).toEqual([]);
  expect(puzzle.value['0,3'].candidates).toEqual(new Set([2, 5, 6]));
  expect(puzzle.value['0,8'].candidates).toEqual(new Set([2, 5]));
});

test('can find pointing numbers', () => {
  const puzzle = ref(
    generateBoardFromString(
      '017903600000080000900000507072010430000402070064370250701000065000030000005601720'
    )
  );
  const hint = ref<Hint>({
    primaryCells: [],
    secondaryCells: [],
    incorrectCells: [],
    message: '',
  });
  eliminateCandidates(puzzle);
  pointingNumbers(puzzle, hint);

  expect(puzzle.value['1,2'].candidates).toEqual(new Set([6]));
  expect(puzzle.value['1,0'].candidates).toEqual(new Set([2, 4, 5, 6]));
});
