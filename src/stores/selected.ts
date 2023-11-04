import { BOARD_SIZE } from '@/assets/constants';
import type { Coords } from '@/types';
import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useSudokuStore } from './sudoku';

export const useSelectedStore = defineStore('selected', () => {
  const selectedCells = ref<Coords[]>([]);
  const sudokuStore = useSudokuStore();
  const { grid } = storeToRefs(sudokuStore);

  function setSelected([y, x]: Coords) {
    selectedCells.value = [[y, x]];
  }

  function appendSelected([y, x]: Coords) {
    selectedCells.value.push([y, x]);
  }

  function selectAll([y, x]: Coords) {
    const cell = grid.value[y][x];
    if (cell.value === 0) return;

    selectedCells.value = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const _cell = grid.value[y][x];
        if (cell.value === _cell.value) {
          selectedCells.value.push([y, x]);
        }
      }
    }
  }

  function arrowKeyMove(direction: string, heldShift: boolean) {
    if (selectedCells.value.length === 0) return;

    const [prevY, prevX] = selectedCells.value.slice(-1)[0];
    let newY = -1;
    let newX = -1;
    if (direction === 'ArrowLeft') {
      if (prevX === 0) return;
      [newY, newX] = [prevY, prevX - 1];
    } else if (direction === 'ArrowRight') {
      if (prevX === BOARD_SIZE - 1) return;
      [newY, newX] = [prevY, prevX + 1];
    } else if (direction === 'ArrowUp') {
      if (prevY === 0) return;
      [newY, newX] = [prevY - 1, prevX];
    } else if (direction === 'ArrowDown') {
      if (prevY === BOARD_SIZE - 1) return;
      [newY, newX] = [prevY + 1, prevX];
    }

    if (heldShift) {
      appendSelected([newY, newX]);
    } else {
      setSelected([newY, newX]);
    }
  }

  return {
    selectedCells,
    setSelected,
    appendSelected,
    selectAll,
    arrowKeyMove,
  };
});
