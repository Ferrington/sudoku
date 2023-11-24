import { BOARD_SIZE, REGION_DICT } from '@/constants';
import type { Hint, SudokuGrid } from '@/types';
import { coordsToString, sameMembers, stringToCoords } from '@/utils/utils';
import type { Ref } from 'vue';

type PositionsInRow = Record<number, number[]>;
type NumberPositions = Record<number, PositionsInRow>;
type xWing = {
  n: number;
  coords: string;
};

const test = {
  2: {
    // number
    0: [
      // y
      0, // x
    ],
  },
};

export function xWing(sudokuGrid: Ref<SudokuGrid>): Hint | null {
  let hint: Hint | null = null;

  function findNumberPositions() {
    const numberPositions: NumberPositions = {};
    for (let i = 0; i < BOARD_SIZE; i++) {
      const cellCoords = REGION_DICT[coordsToString(i, 0)].row;
      cellCoords.forEach((coords) => {
        const [y, x] = stringToCoords(coords);
        sudokuGrid.value[coords].candidates.forEach((n) => {
          if (n in numberPositions) {
            if (y in numberPositions[n]) {
              numberPositions[n][y].push(x);
            } else {
              numberPositions[n][y] = [x];
            }
          } else {
            numberPositions[n] = {
              [y]: [x],
            };
          }
        });
      });
    }
    return numberPositions;
  }

  function findXWings(numberPositions: NumberPositions) {
    const xWings: Record<number, string[][]> = {};
    Object.entries(numberPositions).forEach(([n, positionsInRow]) => {
      const possibles = Object.entries(positionsInRow).filter(
        ([, xPositions]) => xPositions.length === 2
      );
      const possiblesArrs = Object.values(possibles).map((arr) => arr[1]);
      if (possibles.length !== 2 || !sameMembers(possiblesArrs[0], possiblesArrs[1])) return;
      const xWing = possibles
        .map(([y, xPositions]) => {
          return xPositions.map((x) => coordsToString(Number(y), x));
        })
        .flat();

      if (n in xWings) {
        xWings[Number(n)].push(xWing);
      } else {
        xWings[Number(n)] = [xWing];
      }
    });
    return xWings;
  }

  const numberPositions = findNumberPositions();
  const xWings = findXWings(numberPositions);

  console.log(numberPositions);
  console.log(xWings);

  return hint;
}
