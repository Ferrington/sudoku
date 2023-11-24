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
import { computed, ref } from 'vue';

export const useSudokuStore = defineStore('sudoku', () => {
  const sudokuGrid = ref<SudokuGrid>({});
  const difficulty = ref<Difficulty | 'imported'>('easy');
  const history = useHistory(sudokuGrid);
  const selected = useSelected(sudokuGrid);
  const { solvedGrid, solve } = useSolve();
  const { hint, getHint: _getHint, clearHint } = useHint(sudokuGrid, solvedGrid);

  const formattedDifficulty = computed(() => {
    return difficulty.value.charAt(0).toUpperCase() + difficulty.value.slice(1);
  });

  function newGame(diff: Difficulty) {
    clearHint();
    // const sudoku = getSudoku(diff);
    // sudokuGrid.value = generateBoardFromString(sudoku.puzzle);
    // solvedGrid.value = generateBoardFromString(sudoku.solution);
    // difficulty.value = diff;

    const puzzle = generateBoardFromString(
      '100000569492056108056109240009640801064010000218035604040500016905061402621000005'
    );
    sudokuGrid.value = puzzle;
    solve(puzzle);
    difficulty.value = 'imported';
  }

  function importGame(grid: SudokuGrid, solved: SudokuGrid) {
    clearHint();
    sudokuGrid.value = grid;
    solvedGrid.value = solved;
    difficulty.value = 'imported';
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
