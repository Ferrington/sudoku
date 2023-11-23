import type { Hint, SudokuGrid } from '@/types';
import {
  boxLineReduction,
  eliminateCandidates,
  hiddenPair,
  hiddenSingle,
  hiddenTriple,
  nakedPair,
  nakedSingle,
  nakedTriple,
  pointingNumbers,
} from '@/utils/hintMethods';
import { isComplete } from '@/utils/isComplete';
import { isCorrect } from '@/utils/isCorrect';
import { ref, type Ref } from 'vue';

export function useHint(sudokuGrid: Ref<SudokuGrid>, solvedGrid: Ref<SudokuGrid>) {
  const hint = ref<Hint | null>();

  function getHint() {
    clearHint();

    if (!isCorrect(sudokuGrid, solvedGrid)) {
      highlightIncorrectCells();
      console.log('!! Board is wrong !!');
      return;
    } else if (isComplete(sudokuGrid)) {
      return;
    }

    // removes values from candidate set when they are clearly disqualified
    eliminateCandidates(sudokuGrid);

    const hintMethods = [
      nakedSingle,
      hiddenSingle,
      nakedPair,
      hiddenPair,
      pointingNumbers,
      boxLineReduction,
      nakedTriple,
      hiddenTriple,
    ];

    for (const method of hintMethods) {
      hint.value = method(sudokuGrid);
      if (hint.value != null) return;
    }

    hint.value = {
      primaryCells: [],
      secondaryCells: [],
      incorrectCells: [],
      message: "Failed to generate a hint. You're on your own.",
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
