import { BOARD_SIZE, BOX_SIZE } from '@/assets/constants';
import { type Cell, type Coords, type Difficulty, type Region, type SudokuGrid } from '@/types';
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

  function getCell([y, x]: Coords) {
    return sudokuGrid.value[y][x];
  }

  function setCellValue([y, x]: Coords, value: number) {
    sudokuGrid.value[y][x].value = value;
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

  return {
    sudokuGrid,
    getCell,
    setCellValue,
    newGame,
    isCorrect,
    isComplete,
    performCheck,
    performCheckFromCell,
  };
});
