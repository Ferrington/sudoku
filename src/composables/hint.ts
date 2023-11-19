import { useHintMethods } from '@/composables/hintMethods';
import type { Hint, SudokuGrid } from '@/types';
import { ref, type Ref } from 'vue';

export function useHint(sudokuGrid: Ref<SudokuGrid>) {
  const hint = ref<Hint>({
    primaryCells: [],
    secondaryCells: [],
    message: '',
  });

  const { eliminateCandidates, nakedSingle, hiddenSingle, nakedPair, nakedTriple } =
    useHintMethods();

  function getHint() {
    // removes values from candidate set when they are clearly disqualified
    eliminateCandidates(sudokuGrid);

    // will place number if only a single candidate remains
    if (nakedSingle(sudokuGrid, hint)) {
      console.log('last candidate');
      return;
    }

    if (hiddenSingle(sudokuGrid, hint)) {
      console.log('hidden single');
      return;
    }

    if (nakedPair(sudokuGrid, hint)) {
      console.log('naked pair');
      return;
    }

    if (nakedTriple(sudokuGrid, hint)) {
      console.log('naked triple');
      return;
    }

    console.log('!! Failed to generate hint !!');
    hint.value = {
      primaryCells: [],
      secondaryCells: [],
      message: "Failed to generate a hint. You're on your own",
    };
  }

  function clearHint() {
    hint.value = {
      primaryCells: [],
      secondaryCells: [],
      message: '',
    };
  }

  function drawCandidates() {
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
