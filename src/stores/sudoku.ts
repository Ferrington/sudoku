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
  const { solvedGrid } = useSolve();
  const { hint, getHint: _getHint, clearHint } = useHint(sudokuGrid, solvedGrid);

  const formattedDifficulty = computed(() => {
    return difficulty.value.charAt(0).toUpperCase() + difficulty.value.slice(1);
  });

  function newGame(diff: Difficulty) {
    clearHint();
    const sudoku = getSudoku(diff);
    sudokuGrid.value = generateBoardFromString(sudoku.puzzle);
    solvedGrid.value = generateBoardFromString(sudoku.solution);
    difficulty.value = diff;
  }

  function importGame(grid: SudokuGrid, solved: SudokuGrid) {
    clearHint();
    sudokuGrid.value = grid;
    solvedGrid.value = solved;
    difficulty.value = 'imported';
  }

  function isCorrect() {
    return _isCorrect(sudokuGrid.value, solvedGrid.value);
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
