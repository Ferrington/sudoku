import { BOARD_SIZE } from '@/constants';
import type { Menu, PencilMark, SudokuGrid } from '@/types';
import { allContainDigit, coordsToString, stringToCoords } from '@/utils/utils';
import { ref, type Ref } from 'vue';

export function useSelected(sudokuGrid: Ref<SudokuGrid>) {
  // state
  const selectedCells = ref<string[]>([]);
  const activeMenu = ref<Menu>('digit');

  // actions
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

  function selectAllWithValue(value: number) {
    if (value === 0) return;

    const cellCoords: string[] = Object.entries(sudokuGrid.value)
      .filter(([, cell]) => cell.value === value)
      .map(([coords]) => coords);

    setSelected(...cellCoords);
  }

  function setActiveMenu(menu: Menu) {
    activeMenu.value = menu;
  }

  return {
    selectedCells,
    setSelected,
    appendSelected,
    clearSelected,
    arrowKeyMove,
    setValueOnSelected,
    selectAllWithValue,
    activeMenu,
    setActiveMenu,
  };
}
