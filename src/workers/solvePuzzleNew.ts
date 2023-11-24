import { REGION_DICT } from '@/constants';
import type { SudokuGrid } from '@/types';

onmessage = function (e) {
  console.log('Solving Puzzle');

  try {
    const solvedPuzzle = solvePuzzle(e.data);
    postMessage(solvedPuzzle);
  } catch (err) {
    postMessage('error');
    console.log(err);
  }
};

export function solvePuzzle(grid: SudokuGrid) {
  const order = Object.values(grid)
    .filter((cell) => !cell.given)
    .map((cell) => {
      return { coords: cell.coords, candidates: findCandidates(cell.coords, grid) };
    })
    .sort((a, b) => a.candidates.length - b.candidates.length)
    .map((cell) => cell.coords);

  function depthFirstSolve(grid: SudokuGrid): SudokuGrid | undefined {
    grid = structuredClone(grid);
    const coordsString = order.find((cellCoords) => grid[cellCoords].value === 0);
    if (coordsString == null) return grid;

    const candidates = findCandidates(coordsString, grid);
    for (const candidate of candidates) {
      grid[coordsString].value = candidate;

      const result = depthFirstSolve(grid);
      if (result != null) return result;
    }
  }

  function findCandidates(coordsString: string, grid: SudokuGrid) {
    const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];

    const existing = new Set();
    for (const coords of Object.values(REGION_DICT[coordsString]).flat()) {
      if (grid[coords].value === 0) continue;

      existing.add(grid[coords].value);
    }

    return candidates.filter((candidate) => !existing.has(candidate));
  }

  const solved = depthFirstSolve(grid);
  if (solved == null) throw new Error('unable to solve');
  return solved;
}
