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
import { getSudoku } from 'sudoku-gen';
import { computed, ref } from 'vue';

export const useSudokuStore = defineStore('sudoku', () => {
  const sudokuGrid = ref<SudokuGrid>({});
  const difficulty = ref<Difficulty | 'imported'>('easy');
  const history = useHistory(sudokuGrid);
  const selected = useSelected(sudokuGrid);
  const { solvedGrid, solutionReady, solve } = useSolve();
  const { hint, getHint: _getHint, clearHint } = useHint(sudokuGrid, solvedGrid);

  const formattedDifficulty = computed(() => {
    return difficulty.value.charAt(0).toUpperCase() + difficulty.value.slice(1);
  });

  function newGame(diff: Difficulty) {
    clearHint();
    solutionReady.value = false;
    const puzzle = generateSudoku(diff);
    sudokuGrid.value = puzzle;
    difficulty.value = diff;
    solve(puzzle);
  }

  function importGame(grid: SudokuGrid, solved: SudokuGrid) {
    sudokuGrid.value = grid;
    solvedGrid.value = solved;
    difficulty.value = 'imported';
  }

  function generateSudoku(difficulty: Difficulty) {
    const sudoku = getSudoku(difficulty);
    return generateBoardFromString(sudoku.puzzle);
    // return generateBoardFromString(
    //   '078000000400090307090200050000040900003501280000600000205060000000000000000080190'
    // );
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

  function getHint() {
    selected.clearSelected();
    _getHint();
  }

  return {
    sudokuGrid,
    difficulty: formattedDifficulty,
    solutionReady,
    newGame,
    importGame,
    isCorrect,
    isComplete,
    eraseDisqualifiedMarks,
    ...history,
    ...selected,
    hint,
    getHint,
    clearHint,
  };
});
