import { BOARD_SIZE, CELLS, REGION_DICT } from '@/assets/constants';
import type { SudokuGrid } from '@/types';

export function solvePuzzle(grid: SudokuGrid): SudokuGrid {
  const solved = depthFirstSolve(grid);
  if (solved == null) throw new Error('unable to solve');
  return solved;
}

function depthFirstSolve(grid: SudokuGrid): SudokuGrid | undefined {
  grid = structuredClone(grid);
  const coordsString = CELLS.find((cellCoords) => grid[cellCoords].value === 0);
  if (coordsString == null) return grid;

  const candidates = findCandidates(coordsString, grid);
  for (const candidate of candidates) {
    grid[coordsString].value = candidate;

    const result = depthFirstSolve(grid);
    if (result != null) return result;
  }
}

function findCandidates(coordsString: string, grid: SudokuGrid) {
  // nums [1, 9]
  const candidates = [...Array(BOARD_SIZE + 1).keys()].slice(1);

  const existing = new Set(
    REGION_DICT[coordsString]
      .map((region) => region.map((coords) => grid[coords].value))
      .flat()
      .filter((n) => n !== 0)
  );

  return candidates.filter((candidate) => !existing.has(candidate));
}
