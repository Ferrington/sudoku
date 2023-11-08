import { BOARD_SIZE, BOX_SIZE, REGION_DICT } from '@/assets/constants';
import { type Cell, type Difficulty, type PencilMark, type SudokuGrid } from '@/types';
import { generateBoardFromString } from '@/utils/generateBoard';
import { solvePuzzle } from '@/utils/solvePuzzle';
import { allContainDigit, coordsToString } from '@/utils/utils';
import { defineStore, storeToRefs } from 'pinia';
import { getSudoku } from 'sudoku-gen';
import { ref, watch } from 'vue';
import { useHistoryStore } from './history';
import { useMenuStore } from './menu';
import { useSelectedStore } from './selected';

export const useSudokuGridStore = defineStore('sudokuGrid', () => {
  const sudokuGrid = ref<SudokuGrid>({});
  const solvedGrid = ref<SudokuGrid>({});
  const preventUpdate = ref(false);
  const selectedStore = useSelectedStore();
  const { setSelected } = selectedStore;
  const { selectedCells } = storeToRefs(selectedStore);
  const menuStore = useMenuStore();
  const { activeMenu } = storeToRefs(menuStore);
  const historyStore = useHistoryStore();
  const { addSnapshot, prevSnapshot, nextSnapshot } = historyStore;

  newGame('easy');

  function newGame(difficulty: Difficulty) {
    const puzzle = generateSudoku(difficulty);
    sudokuGrid.value = puzzle;
    try {
      solvedGrid.value = solvePuzzle(puzzle);
    } catch (err) {
      console.log(err);
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

  function setValueOnSelected(digit: number) {
    if (digit === 0) {
      clearValuesOnSelected();
    }

    if (activeMenu.value === 'digit') {
      setDigitOnSelected(digit);
    } else {
      setPencilMarkOnSelected(digit, activeMenu.value);
    }
  }

  function clearValuesOnSelected() {
    selectedCells.value.forEach((coordString) => {
      const cell = sudokuGrid.value[coordString];
      if (cell.given) return;
      cell.value = 0;
      cell.pencilMarks = [];
    });
  }

  function setDigitOnSelected(digit: number) {
    const allSelectedEqual = allContainDigit(
      selectedCells.value.map((coordString) => sudokuGrid.value[coordString].value),
      digit
    );

    selectedCells.value.forEach((coordString) => {
      const cell = sudokuGrid.value[coordString];
      if (cell.given) return;
      cell.value = cell.value === digit && allSelectedEqual ? 0 : digit;
      cell.pencilMarks = [];
    });
  }

  function setPencilMarkOnSelected(digit: number, type: PencilMark) {
    const allCellsContainDigit = allContainDigit(
      selectedCells.value.map((coordString) => sudokuGrid.value[coordString].pencilMarks),
      digit
    );

    selectedCells.value.forEach((coordString) => {
      const cell = sudokuGrid.value[coordString];
      if (cell.given) return;
      if (cell.value > 0) return;
      if (digit === 0) {
        cell.pencilMarks = [];
        return;
      }
      if (cell.pencilMarkType !== type) {
        cell.pencilMarks = [];
        cell.pencilMarkType = type;
      }

      if (cell.pencilMarks.includes(digit) && allCellsContainDigit) {
        cell.pencilMarks = cell.pencilMarks.filter((n) => n !== digit);
      } else if (!cell.pencilMarks.includes(digit)) {
        const newMarks = [...cell.pencilMarks, digit];
        cell.pencilMarks = newMarks.sort();
      }
      cell.value = 0;
    });
  }

  function eraseDisqualifiedMarks() {
    performCheck(true, (cells: Cell[]) => {
      const values = cells.map((cell) => cell.value).filter((val) => val !== 0);
      cells.forEach(
        (cell) => (cell.pencilMarks = cell.pencilMarks.filter((mark) => !values.includes(mark)))
      );
    });
  }

  function selectAllWithValue(value: number) {
    if (value === 0) return;

    const cellCoords: string[] = Object.entries(sudokuGrid.value)
      .filter(([, cell]) => cell.value === value)
      .map(([coords]) => coords);

    setSelected(...cellCoords);
  }

  function undo() {
    const prev = prevSnapshot();
    if (prev == null) return;
    preventUpdate.value = true;
    sudokuGrid.value = prev;
  }

  function redo() {
    const next = nextSnapshot();
    if (next == null) return;
    preventUpdate.value = true;
    sudokuGrid.value = next;
  }

  watch(
    sudokuGrid,
    (grid) => {
      if (preventUpdate.value) {
        preventUpdate.value = false;
        return;
      }
      addSnapshot(grid);
    },
    { immediate: true, deep: true }
  );

  return {
    sudokuGrid,
    newGame,
    isCorrect,
    isComplete,
    performCheck,
    performCheckFromCell,
    setValueOnSelected,
    eraseDisqualifiedMarks,
    selectAllWithValue,
    undo,
    redo,
  };
});
