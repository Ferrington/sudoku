import type { SudokuGrid } from '@/types';
import { ref } from 'vue';

export function useSolve() {
  const worker = new Worker(new URL('@/workers/solvePuzzle.js', import.meta.url), {
    type: 'module',
  });
  const solvedGrid = ref<SudokuGrid>({});
  const solutionReady = ref(false);

  function solve(puzzle: SudokuGrid) {
    worker.postMessage(puzzle);
  }

  worker.onmessage = (e) => {
    solvedGrid.value = e.data;
    solutionReady.value = true;
    console.log('Puzzle Solved!');
  };

  return {
    solvedGrid,
    solutionReady,
    solve,
  };
}
