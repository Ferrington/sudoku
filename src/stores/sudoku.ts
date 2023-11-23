import { useHint } from '@/composables/hint';
import { useHistory } from '@/composables/history';
import { useSelected } from '@/composables/selected';
import { useSolve } from '@/composables/solve';
import { type Cell, type Difficulty, type SudokuGrid } from '@/types';
import { generateBoardFromString } from '@/utils/generateBoard';
import { isComplete as _isComplete } from '@/utils/isComplete';
import { isCorrect as _isCorrect } from '@/utils/isCorrect';
import { performCheck } from '@/utils/performCheck';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSudokuStore = defineStore('sudoku', () => {
  const sudokuGrid = ref<SudokuGrid>({});
  const history = useHistory(sudokuGrid);
  const selected = useSelected(sudokuGrid);
  const { solvedGrid, solutionReady, solve } = useSolve();
  const hint = useHint(sudokuGrid, solvedGrid);

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
    // const sudoku = getSudoku(difficulty);
    // return generateBoardFromString(sudoku.puzzle);
    return generateBoardFromString(
      '017903600000080000900000507072010430000402070064370250701000065000030000005601720'
    );
  }

  function isCorrect() {
    return _isCorrect(sudokuGrid, solvedGrid);
  }

  function isComplete() {
    return _isComplete(sudokuGrid);
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
