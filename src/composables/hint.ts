import { useHintMethods } from '@/composables/hintMethods';
import type { Hint, SudokuGrid } from '@/types';
import { isCorrect } from '@/utils/isCorrect';
import { ref, type Ref } from 'vue';

export function useHint(sudokuGrid: Ref<SudokuGrid>, solvedGrid: Ref<SudokuGrid>) {
  const hint = ref<Hint>({
    primaryCells: [],
    secondaryCells: [],
    incorrectCells: [],
    message: '',
  });

  const { eliminateCandidates, nakedSingle, hiddenSingle, nakedPair, nakedTriple } =
    useHintMethods();

  function getHint() {
    clearHint();

    if (!isCorrect(sudokuGrid, solvedGrid)) {
      highlightIncorrectCells();
      console.log('!! board is wrong !!');
      return;
    }

    // removes values from candidate set when they are clearly disqualified
    eliminateCandidates(sudokuGrid);

    const hintMethods = [nakedSingle, hiddenSingle, nakedPair, nakedTriple];

    const generatedHint = hintMethods.some((method) => {
      if (method(sudokuGrid, hint)) {
        console.log(method.name);
        return true;
      }
      return false;
    });
    if (generatedHint) return;

    hint.value = {
      primaryCells: [],
      secondaryCells: [],
      incorrectCells: [],
      message: "Failed to generate a hint. You're on your own",
    };
    console.log('!! Failed to generate hint !!');
  }

  function highlightIncorrectCells() {
    const incorrectCells: string[] = [];
    Object.entries(solvedGrid.value).forEach(([coordsString, solvedCell]) => {
      const cellValue = sudokuGrid.value[coordsString].value;
      if (cellValue !== 0 && cellValue !== solvedCell.value) {
        incorrectCells.push(coordsString);
      }
    });

    hint.value = {
      primaryCells: [],
      secondaryCells: [],
      incorrectCells,
      message: `${incorrectCells.length > 1 ? 'Cells are' : 'A cell is'} incorrect.`,
    };
  }

  function clearHint() {
    hint.value = {
      primaryCells: [],
      secondaryCells: [],
      incorrectCells: [],
      message: '',
    };
  }

  function drawCandidates() {
    if (!isCorrect(sudokuGrid, solvedGrid)) {
      highlightIncorrectCells();
      console.log('!! board is wrong !!');
      return;
    }

    eliminateCandidates(sudokuGrid);

    Object.entries(sudokuGrid.value).forEach(([coords, cell]) => {
      cell.pencilMarkType = 'side';
      cell.pencilMarks = [...sudokuGrid.value[coords].candidates];
    });
  }

  return {
    hint,
    getHint,
    clearHint,
    drawCandidates,
  };
}
