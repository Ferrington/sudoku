import { BOARD_SIZE, BOX_SIZE } from '@/assets/constants';
import { type Cell, type Difficulty, type SudokuGrid } from '@/types';
import { generateBoardFromString } from '@/utils/generateBoard';
import { defineStore } from 'pinia';
import { getSudoku } from 'sudoku-gen';
import { ref } from 'vue';

export const useSudokuGridStore = defineStore('sudokuGrid', () => {
  const sudokuGrid = ref<SudokuGrid>(generateSudoku('easy'));

  function newGame(difficulty: Difficulty) {
    sudokuGrid.value = generateSudoku(difficulty);
  }

  function generateSudoku(difficulty: Difficulty) {
    const sudoku = getSudoku(difficulty);
    return generateBoardFromString(sudoku.puzzle);
  }

  function performCheck(check: Function) {
    const REGION_MAPPING = {
      row: (a: number, b: number) => sudokuGrid.value[a][b],
      col: (a: number, b: number) => sudokuGrid.value[b][a],
      box: (a: number, b: number) => {
        const y = Math.floor(b / BOX_SIZE) + BOX_SIZE * Math.floor(a / BOX_SIZE);
        const x = (b % BOX_SIZE) + BOX_SIZE * (a % BOX_SIZE);
        return sudokuGrid.value[y][x];
      },
    };

    let result = true;
    for (let i = 0; i < BOARD_SIZE; i++) {
      for (const mapFunction of Object.values(REGION_MAPPING)) {
        const regionCells = [];
        for (let j = 0; j < BOARD_SIZE; j++) {
          regionCells.push(mapFunction(i, j));
        }
        if (!check(regionCells)) result = false;
      }
    }
    return result;
  }

  function isCorrect() {
    return performCheck((cells: Cell[]) => {
      const values = cells.map((cell) => cell.value).filter((val) => val !== 0);
      return values.length === new Set(values).size;
    });
  }

  function isComplete() {
    return !sudokuGrid.value.flat().some((cell) => cell.value === 0);
  }

  return {
    sudokuGrid,
    newGame,
    isCorrect,
    isComplete,
    performCheck,
  };
});
