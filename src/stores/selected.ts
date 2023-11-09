import { BOARD_SIZE } from '@/constants';
import { coordsToString, stringToCoords } from '@/utils/utils';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useSelectedStore = defineStore('selected', () => {
  const selectedCells = ref<string[]>([]);

  function setSelected(...coords: string[]) {
    selectedCells.value = coords;
  }

  function appendSelected(coords: string) {
    if (selectedCells.value.includes(coords)) return;
    selectedCells.value.push(coords);
  }

  function clearSelected() {
    selectedCells.value = [];
  }

  function arrowKeyMove(direction: string, heldShift: boolean) {
    if (selectedCells.value.length === 0) return;

    const [prevY, prevX] = stringToCoords(selectedCells.value.slice(-1)[0]);
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
      appendSelected(coordsToString(newY, newX));
    } else {
      setSelected(coordsToString(newY, newX));
    }
  }

  return {
    selectedCells,
    setSelected,
    appendSelected,
    clearSelected,
    arrowKeyMove,
  };
});
