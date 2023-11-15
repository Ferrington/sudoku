import { BOARD_SIZE, CELLS, REGION_DICT } from '@/constants';

onmessage = function (e) {
  console.log('Solving Puzzle');

  try {
    const solvedPuzzle = solvePuzzle(e.data);
    postMessage(solvedPuzzle);
  } catch (err) {
    console.log(err);
  }
};

export function solvePuzzle(grid) {
  const solved = depthFirstSolve(grid);
  if (solved == null) throw new Error('unable to solve');
  return solved;
}

function depthFirstSolve(grid) {
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

function findCandidates(coordsString, grid) {
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
