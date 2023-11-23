import { useSudokuStore } from '@/stores/sudoku';

export function useGlobalInputs() {
  const {
    clearSelected,
    setValueOnSelected,
    eraseDisqualifiedMarks,
    undo,
    redo,
    setActiveMenu,
    arrowKeyMove,
  } = useSudokuStore();

  window.addEventListener('keydown', (e) => {
    if (e.key.toLowerCase() === 'z') {
      if (e.getModifierState('Control') && e.getModifierState('Shift')) redo();
      else if (e.getModifierState('Control')) undo();
      else setActiveMenu('digit');
    } else if (e.key === 'x') setActiveMenu('side');
    else if (e.key === 'c') setActiveMenu('center');
    else if (e.key === '.' || e.key === '`') eraseDisqualifiedMarks();
    else if (['Delete', 'Backspace'].includes(e.key)) {
      setValueOnSelected(0);
    } else if (!isNaN(Number(e.key))) {
      setValueOnSelected(Number(e.key));
    } else if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) {
      arrowKeyMove(e.key, e.getModifierState('Shift'));
    } else if (e.key === 'Escape') {
      clearSelected();
    }
  });
}
