import { useHint } from '@/composables/hint';
import { useHistory } from '@/composables/history';
import { useSelected } from '@/composables/selected';
import { useSolve } from '@/composables/solve';
import { type Cell, type Difficulty, type SudokuGrid } from '@/types';
import { generateBoardFromString } from '@/utils/generateBoard';
import { performCheck } from '@/utils/performCheck';
import { defineStore } from 'pinia';
import { getSudoku } from 'sudoku-gen';
import { ref } from 'vue';

export const useSudokuStore = defineStore('sudoku', () => {
  const sudokuGrid = ref<SudokuGrid>({});
  const history = useHistory(sudokuGrid);
  const selected = useSelected(sudokuGrid);
  const hint = useHint(sudokuGrid);

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
    // return generateBoardFromString(sudoku.puzzle);
    // return generateBoardFromString(
    //   '294513006600842319300697254000056000040080060000470000730164005900735001400928637'
    // );
    return generateBoardFromString(
      '294513006600842319300697254000056000040080060000470000730164005900735001400928637'
    );
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
    performCheck(sudokuGrid.value, true, (cells: Cell[]) => {
      const values = cells.map((cell) => cell.value).filter((val) => val !== 0);
      cells.forEach(
        (cell) => (cell.pencilMarks = cell.pencilMarks.filter((mark) => !values.includes(mark)))
      );
      return true;
    });
  }

  return {
    sudokuGrid,
    solutionReady,
    newGame,
    importGame,
    isCorrect,
    isComplete,
    eraseDisqualifiedMarks,
    ...history,
    ...selected,
    ...hint,
  };
});
