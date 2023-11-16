import { REGION_DICT } from '@/constants';
import { useSudokuGridStore } from '@/stores/sudokuGrid';
import type { Hint, SolutionGrid } from '@/types';
import { defineStore, storeToRefs } from 'pinia';
import { ref } from 'vue';

export const useHintStore = defineStore('hint', () => {
  const sudokuGridStore = useSudokuGridStore();
  const { sudokuGrid } = storeToRefs(sudokuGridStore);
  const solutionGrid = ref<SolutionGrid>({});
  const hint = ref<Hint>({
    primaryCell: '',
    secondaryCells: [],
    message: '',
  });

  function getHint() {
    generateSolutionGrid();

    let gridChanged = true;
    while (gridChanged) {
      gridChanged = false;

      // will place number if only a single candidate remains
      const placedCoords = placeNumbers();
      if (placedCoords) {
        hint.value = {
          primaryCell: placedCoords,
          secondaryCells: [],
          message: 'There is only one number that can be placed in this cell.',
        };
        console.log('number placed');
        return;
      }

      // removes values from candidate set when they are clearly disqualified
      if (eliminateCandidates()) {
        gridChanged = true;
        console.log('eliminated obvious candidates');

        Object.entries(sudokuGrid.value).forEach(([coords, cell]) => {
          cell.pencilMarkType = 'side';
          cell.pencilMarks = [...solutionGrid.value[coords].candidates];
        });

        continue;
      }
    }
  }

  function eliminateCandidates() {
    let eliminatedCandidates = false;
    let gridChanged = true;
    while (gridChanged) {
      gridChanged = false;
      Object.entries(solutionGrid.value).forEach(([coordsString, cell]) => {
        if (cell.value === 0) return;
        REGION_DICT[coordsString].forEach((coordsStrings) => {
          coordsStrings.forEach((coords) => {
            if (!solutionGrid.value[coords].candidates.has(cell.value)) return;
            solutionGrid.value[coords].candidates.delete(cell.value);
            eliminatedCandidates = true;
            gridChanged = true;
          });
        });
      });
    }
    return eliminatedCandidates;
  }

  function placeNumbers() {
    let placedCoords = '';
    Object.entries(solutionGrid.value).some(([coords, cell]) => {
      if (cell.candidates.size !== 1) return false;

      placedCoords = coords;
      cell.value = cell.candidates.values().next().value;
      cell.candidates.clear();
      return true;
    });
    return placedCoords;
  }

  function generateSolutionGrid() {
    const entries = Object.entries(sudokuGrid.value).map(([coordsString, cell]) => {
      return [
        coordsString,
        {
          given: cell.given,
          value: cell.value,
          candidates: new Set(cell.given ? [] : [1, 2, 3, 4, 5, 6, 7, 8, 9]),
        },
      ];
    });

    solutionGrid.value = Object.fromEntries(entries);
  }

  function clearHint() {
    hint.value = {
      primaryCell: '',
      secondaryCells: [],
      message: '',
    };
  }

  return {
    hint,
    getHint,
    clearHint,
  };
});
