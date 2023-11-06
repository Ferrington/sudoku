import { BOARD_SIZE, BOX_SIZE } from '@/assets/constants';
import {
  type Cell,
  type Coords,
  type Difficulty,
  type PencilMark,
  type Region,
  type SudokuGrid,
} from '@/types';
import { generateBoardFromString } from '@/utils/generateBoard';
import { allContainDigit } from '@/utils/utils';
import { defineStore, storeToRefs } from 'pinia';
import { getSudoku } from 'sudoku-gen';
import { ref } from 'vue';
import { useMenuStore } from './menu';
import { useSelectedStore } from './selected';

export const useSudokuGridStore = defineStore('sudokuGrid', () => {
  const sudokuGrid = ref<SudokuGrid>(generateSudoku('easy'));
  const selectedStore = useSelectedStore();
  const { setSelected } = selectedStore;
  const { selectedCells } = storeToRefs(selectedStore);
  const menuStore = useMenuStore();
  const { activeMenu } = storeToRefs(menuStore);

  function getCell([y, x]: Coords) {
    return sudokuGrid.value[y][x];
  }

  function newGame(difficulty: Difficulty) {
    sudokuGrid.value = generateSudoku(difficulty);
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
      if (!performCheckFromCell([y, x], checkAll, check)) result = !checkAll;
    }
    return result;
  }

  function performCheckFromCell(coords: Coords, checkAll: boolean, check: Function) {
    let result = checkAll;
    const regions: Region[] = ['row', 'col', 'box'];
    for (const region of regions) {
      const regionCells = [];
      for (let i = 0; i < BOARD_SIZE; i++) {
        const [y, x] = getRelativeCoords(region, coords, i);
        regionCells.push(sudokuGrid.value[y][x]);
      }
      if (!check(regionCells)) result = !checkAll;
    }
    return result;
  }

  function getRelativeCoords(region: Region, [y, x]: Coords, i: number): Coords {
    switch (region) {
      case 'row':
        return [y, i];
      case 'col':
        return [i, x];
      case 'box': {
        const newY = BOX_SIZE * Math.floor(x / BOX_SIZE) + Math.floor(i / BOX_SIZE);
        const newX = BOX_SIZE * Math.floor(y / BOX_SIZE) + (i % BOX_SIZE);
        return [newY, newX];
      }
    }
  }

  function isCorrect() {
    return performCheck(true, (cells: Cell[]) => {
      const values = cells.map((cell) => cell.value).filter((val) => val !== 0);
      return values.length === new Set(values).size;
    });
  }

  function isComplete() {
    return !sudokuGrid.value.flat().some((cell) => cell.value === 0);
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
    selectedCells.value.forEach(([y, x]) => {
      const cell = sudokuGrid.value[y][x];
      if (cell.given) return;
      cell.value = 0;
      cell.pencilMarks = [];
    });
  }

  function setDigitOnSelected(digit: number) {
    const allSelectedEqual = allContainDigit(
      selectedCells.value.map(([y, x]) => sudokuGrid.value[y][x].value),
      digit
    );

    selectedCells.value.forEach(([y, x]) => {
      const cell = sudokuGrid.value[y][x];
      if (cell.given) return;
      cell.value = cell.value === digit && allSelectedEqual ? 0 : digit;
      cell.pencilMarks = [];
    });
  }

  function setPencilMarkOnSelected(digit: number, type: PencilMark) {
    const allCellsContainDigit = allContainDigit(
      selectedCells.value.map(([y, x]) => sudokuGrid.value[y][x].pencilMarks),
      digit
    );

    selectedCells.value.forEach(([y, x]) => {
      const cell = sudokuGrid.value[y][x];
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

    const cells: Coords[] = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const cell = getCell([y, x]);
        if (value === cell.value) {
          cells.push([y, x]);
        }
      }
    }
    setSelected(...cells);
  }

  return {
    sudokuGrid,
    getCell,
    newGame,
    isCorrect,
    isComplete,
    performCheck,
    performCheckFromCell,
    setValueOnSelected,
    eraseDisqualifiedMarks,
    selectAllWithValue,
  };
});
