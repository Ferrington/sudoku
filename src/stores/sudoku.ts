import { BOARD_SIZE } from '@/assets/constants';
import { type Difficulty, type PencilMark, type SudokuGrid } from '@/types';
import { generateBoardFromString } from '@/utils/generateBoard';
import { allContainDigit } from '@/utils/utils.js';
import { defineStore, storeToRefs } from 'pinia';
import { getSudoku } from 'sudoku-gen';
import { ref } from 'vue';
import { useMenuStore } from './menu';
import { useSelectedStore } from './selected';

export const useSudokuStore = defineStore('sudoku', () => {
  const grid = ref<SudokuGrid>(generateSudoku('easy'));
  const selectedStore = useSelectedStore();
  const { selectedCells } = storeToRefs(selectedStore);
  const menuStore = useMenuStore();
  const { activeMenu } = storeToRefs(menuStore);

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
      const cell = grid.value[y][x];
      if (cell.given) return;
      cell.value = 0;
      cell.pencilMarks = [];
    });
  }

  function setDigitOnSelected(digit: number) {
    const allSelectedEqual = allContainDigit(
      selectedCells.value.map(([y, x]) => grid.value[y][x].value),
      digit
    );

    selectedCells.value.forEach(([y, x]) => {
      const cell = grid.value[y][x];
      if (cell.given) return;
      cell.value = cell.value === digit && allSelectedEqual ? 0 : digit;
      cell.pencilMarks = [];
    });
  }

  function setPencilMarkOnSelected(digit: number, type: PencilMark) {
    const allCellsContainDigit = allContainDigit(
      selectedCells.value.map(([y, x]) => grid.value[y][x].pencilMarks),
      digit
    );

    selectedCells.value.forEach(([y, x]) => {
      const cell = grid.value[y][x];
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

  function newGame(difficulty: Difficulty) {
    grid.value = generateSudoku(difficulty);
  }

  function generateSudoku(difficulty: Difficulty) {
    const sudoku = getSudoku(difficulty);
    return generateBoardFromString(sudoku.puzzle);
  }

  function isCorrect() {
    let isCorrect = true;
    for (let y = 0; y < BOARD_SIZE; y++) {
      const rowWithoutZeros = grid.value[y].filter((cell) => cell.value !== 0);
      if (rowWithoutZeros.length !== new Set(rowWithoutZeros).size) isCorrect = false;
    }

    for (let x = 0; x < BOARD_SIZE; x++) {
      const columnWithoutZeros = [];
      for (let y = 0; y < BOARD_SIZE; y++) {
        const cell = grid.value[y][x];
        if (cell.value !== 0) columnWithoutZeros.push(cell.value);
      }

      if (columnWithoutZeros.length !== new Set(columnWithoutZeros).size) isCorrect = false;
    }

    for (let boxNumber = 0; boxNumber < BOARD_SIZE; boxNumber++) {
      const boxWithoutZeros = [];
      for (let cellNumber = 0; cellNumber < BOARD_SIZE; cellNumber++) {
        const y = Math.floor(boxNumber / 3) * 3 + Math.floor(cellNumber / 3);
        const x = (boxNumber % 3) * 3 + (cellNumber % 3);
        const cell = grid.value[y][x];
        if (cell.value !== 0) boxWithoutZeros.push(cell.value);
      }

      if (boxWithoutZeros.length !== new Set(boxWithoutZeros).size) isCorrect = false;
    }

    return isCorrect;
  }

  function isComplete() {
    return !grid.value.flat().some((cell) => cell.value === 0);
  }

  return {
    grid,
    setValueOnSelected,
    newGame,
    isCorrect,
    isComplete,
  };
});
