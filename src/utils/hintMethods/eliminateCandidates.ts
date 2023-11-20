import { REGION_DICT } from '@/constants';
import type { SudokuGrid } from '@/types';
import type { Ref } from 'vue';

export function eliminateCandidates(sudokuGrid: Ref<SudokuGrid>) {
  let eliminatedCandidates = false;
  do {
    eliminatedCandidates = _eliminateCandidates(sudokuGrid);
  } while (eliminatedCandidates);
}

function _eliminateCandidates(sudokuGrid: Ref<SudokuGrid>) {
  let eliminatedCandidates = false;

  // loop over every 'given'
  Object.entries(sudokuGrid.value).forEach(([coordsString, cell]) => {
    if (cell.value === 0) return;

    // remove 'given' value from regions occupied by the cell
    Object.values(REGION_DICT[coordsString])
      .flat()
      .map((coords) => sudokuGrid.value[coords].candidates)
      .forEach((candidates) => {
        if (!candidates.has(cell.value)) return;
        candidates.delete(cell.value);
        eliminatedCandidates = true;
      });
  });
  return eliminatedCandidates;
}
