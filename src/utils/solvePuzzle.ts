import { CELLS, REGION_DICT } from '@/constants';
import type { SudokuGrid } from '@/types';
import { isCorrect } from './isCorrect';

const test = CELLS;

// no sort
export function solvePuzzle(grid: SudokuGrid) {
  let recursiveCalls = 0;
  const time = Date.now();
  const order = CELLS.filter((coords) => !grid[coords].given);

  function depthFirstSolve(coords: string | undefined): boolean {
    recursiveCalls++;
    if (coords == null) return true;

    const candidates = findCandidates(coords, grid);
    for (const candidate of candidates) {
      grid[coords].value = candidate;
      if (depthFirstSolve(order[order.indexOf(coords) + 1]) && isCorrect(grid)) return true;
      grid[coords].value = 0;
    }
    return false;
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

  function findNextCellCoords() {
    const coords = Object.values(grid)
      .filter((cell) => !cell.given && cell.value === 0)
      .map((cell) => {
        return { coords: cell.coords, candidates: findCandidates(cell.coords, grid) };
      })
      .sort((a, b) => a.candidates.length - b.candidates.length)
      .map((cell) => cell.coords)[0];
    return coords;
  }

  if (!depthFirstSolve(order[0])) throw new Error('unable to solve');
  console.log(recursiveCalls);
  console.log(Date.now() - time + 'ms');
  return structuredClone(grid);
}

// initial sort
// export function solvePuzzle(grid: SudokuGrid) {
//   let recursiveCalls = 0;
//   const time = Date.now();
//   const order = Object.values(grid)
//     .filter((cell) => !cell.given)
//     .map((cell) => {
//       return { coords: cell.coords, candidates: findCandidates(cell.coords, grid) };
//     })
//     .sort((a, b) => a.candidates.length - b.candidates.length)
//     .map((cell) => cell.coords);

//   function depthFirstSolve(coords: string | undefined): boolean {
//     recursiveCalls++;
//     if (coords == null) return true;

//     const candidates = findCandidates(coords, grid);
//     for (const candidate of candidates) {
//       grid[coords].value = candidate;
//       if (depthFirstSolve(order[order.indexOf(coords) + 1]) && isCorrect(grid)) return true;
//       grid[coords].value = 0;
//     }
//     return false;
//   }

//   function findCandidates(coordsString: string, grid: SudokuGrid) {
//     const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];

//     const existing = new Set();
//     for (const coords of Object.values(REGION_DICT[coordsString]).flat()) {
//       if (grid[coords].value === 0) continue;

//       existing.add(grid[coords].value);
//     }

//     return candidates.filter((candidate) => !existing.has(candidate));
//   }

//   function findNextCellCoords() {
//     const coords = Object.values(grid)
//       .filter((cell) => !cell.given && cell.value === 0)
//       .map((cell) => {
//         return { coords: cell.coords, candidates: findCandidates(cell.coords, grid) };
//       })
//       .sort((a, b) => a.candidates.length - b.candidates.length)
//       .map((cell) => cell.coords)[0];
//     return coords;
//   }

//   if (!depthFirstSolve(order[0])) throw new Error('unable to solve');
//   console.log(recursiveCalls);
//   console.log(Date.now() - time + 'ms');
//   return structuredClone(grid);
// }

// every sort
// export function solvePuzzle(grid: SudokuGrid) {
//   let recursiveCalls = 0;
//   const time = Date.now();

//   function depthFirstSolve(coords: string | undefined): boolean {
//     recursiveCalls++;
//     if (coords == null) return true;

//     const candidates = findCandidates(coords, grid);
//     for (const candidate of candidates) {
//       grid[coords].value = candidate;
//       if (depthFirstSolve(findNextCellCoords()) && isCorrect(grid)) return true;
//       grid[coords].value = 0;
//     }
//     return false;
//   }

//   function findCandidates(coordsString: string, grid: SudokuGrid) {
//     const candidates = [1, 2, 3, 4, 5, 6, 7, 8, 9];

//     const existing = new Set();
//     for (const coords of Object.values(REGION_DICT[coordsString]).flat()) {
//       if (grid[coords].value === 0) continue;

//       existing.add(grid[coords].value);
//     }

//     return candidates.filter((candidate) => !existing.has(candidate));
//   }

//   function findNextCellCoords() {
//     const coords = Object.values(grid)
//       .filter((cell) => !cell.given && cell.value === 0)
//       .map((cell) => {
//         return { coords: cell.coords, candidates: findCandidates(cell.coords, grid) };
//       })
//       .sort((a, b) => a.candidates.length - b.candidates.length);
//     return coords[0]?.coords;
//   }

//   if (!depthFirstSolve(findNextCellCoords())) throw new Error('unable to solve');
//   console.log(recursiveCalls);
//   console.log(Date.now() - time + 'ms');
//   return structuredClone(grid);
// }
