import { BOARD_SIZE } from '@/assets/constants';
import type { Cell, Coords, PencilMark } from '@/types';
import { allContainDigit } from '@/utils/utils';
import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';
import { useMenuStore } from './menu';
import { useSudokuGridStore } from './sudokuGrid';

export const useSelectedStore = defineStore('selected', () => {
  const selectedCells = ref<Coords[]>([]);
  const sudokuGridStore = useSudokuGridStore();
  const { performCheck } = sudokuGridStore;
  const { sudokuGrid } = storeToRefs(sudokuGridStore);
  const menuStore = useMenuStore();
  const { activeMenu } = storeToRefs(menuStore);

  function setSelected([y, x]: Coords) {
    selectedCells.value = [[y, x]];
  }

  function appendSelected([y, x]: Coords) {
    selectedCells.value.push([y, x]);
  }

  function clearSelected() {
    selectedCells.value = [];
  }

  function selectAll([y, x]: Coords) {
    const cell = sudokuGrid.value[y][x];
    if (cell.value === 0) return;

    selectedCells.value = [];
    for (let y = 0; y < BOARD_SIZE; y++) {
      for (let x = 0; x < BOARD_SIZE; x++) {
        const _cell = sudokuGrid.value[y][x];
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
    performCheck((cells: Cell[]) => {
      const values = cells.map((cell) => cell.value).filter((val) => val !== 0);
      cells.forEach(
        (cell) => (cell.pencilMarks = cell.pencilMarks.filter((mark) => !values.includes(mark)))
      );
    });
  }

  return {
    selectedCells,
    setSelected,
    appendSelected,
    clearSelected,
    selectAll,
    arrowKeyMove,
    setValueOnSelected,
    clearValuesOnSelected,
    setDigitOnSelected,
    setPencilMarkOnSelected,
    eraseDisqualifiedMarks,
  };
});
