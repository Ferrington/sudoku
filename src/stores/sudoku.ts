import { BOARD_SIZE } from '@/assets/constants';
import { type Difficulty, type SudokuGrid } from '@/types';
import { generateBoardFromString } from '@/utils/generateBoard';
import { defineStore } from 'pinia';
import { getSudoku } from 'sudoku-gen';
import { ref } from 'vue';

export const useSudokuStore = defineStore('sudoku', () => {
  const grid = ref<SudokuGrid>(generateSudoku('easy'));

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
    newGame,
    isCorrect,
    isComplete,
  };
});
