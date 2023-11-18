import { useHistory } from '@/composables/history';
import { useSelected } from '@/composables/selected';
import { useSolve } from '@/composables/solve';
import { BOARD_SIZE, BOX_SIZE, REGION_DICT } from '@/constants';
import { type Cell, type Difficulty, type SudokuGrid } from '@/types';
import { generateBoardFromString } from '@/utils/generateBoard';
import { coordsToString } from '@/utils/utils';
import { defineStore } from 'pinia';
import { getSudoku } from 'sudoku-gen';
import { ref } from 'vue';

export const useSudokuStore = defineStore('sudoku', () => {
  const sudokuGrid = ref<SudokuGrid>({});
  const history = useHistory(sudokuGrid);
  const selected = useSelected(sudokuGrid);

  const { solvedGrid, solutionReady, solve } = useSolve();

  function newGame(difficulty: Difficulty) {
    solutionReady.value = false;
    const puzzle = generateSudoku(difficulty);
    sudokuGrid.value = puzzle;
    solve(puzzle);
  }

  function importGame(puzzleString: string) {
    try {
      const puzzle = generateBoardFromString(puzzleString);
      sudokuGrid.value = puzzle;
      solve(puzzle);
    } catch (error) {
      alert(error);
    }
  }

  function generateSudoku(difficulty: Difficulty) {
    const sudoku = getSudoku(difficulty);
    return generateBoardFromString(sudoku.puzzle);
  }

  function performCheck(checkAll: boolean, check: Function) {
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
    let result = checkAll;
    for (let i = 0; i < BOARD_SIZE; i++) {
      const y = i;
      const x = (i % BOX_SIZE) * BOX_SIZE + Math.floor(i / BOX_SIZE);
      if (!performCheckFromCell(coordsToString(y, x), checkAll, check)) result = !checkAll;
    }
    return result;
  }

  function performCheckFromCell(coordsString: string, checkAll: boolean, check: Function) {
    let result = checkAll;

    REGION_DICT[coordsString].forEach((region) => {
      const cells = region.map((coords) => sudokuGrid.value[coords]);
      if (!check(cells)) result = !checkAll;
    });

    return result;
  }

  function isCorrect() {
    return Object.entries(solvedGrid.value).reduce((bool, [coordsString, solvedCell]) => {
      const cellValue = sudokuGrid.value[coordsString].value;
      if (cellValue !== 0 && cellValue !== solvedCell.value) return false;
      return bool;
    }, true);
  }

  function isComplete() {
    return !Object.values(sudokuGrid.value).some((cell) => cell.value === 0);
  }

  function eraseDisqualifiedMarks() {
    performCheck(true, (cells: Cell[]) => {
      const values = cells.map((cell) => cell.value).filter((val) => val !== 0);
      cells.forEach(
        (cell) => (cell.pencilMarks = cell.pencilMarks.filter((mark) => !values.includes(mark)))
      );
    });
  }

  return {
    sudokuGrid,
    solutionReady,
    newGame,
    importGame,
    isCorrect,
    isComplete,
    performCheck,
    performCheckFromCell,
    eraseDisqualifiedMarks,
    ...history,
    ...selected,
  };
});
