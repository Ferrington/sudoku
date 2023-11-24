import type { SudokuGrid } from '@/types';
import { ref } from 'vue';

export type SolutionStatus = 'solved' | 'solving' | 'failed';

export function useSolveNew() {
  const worker = new Worker(new URL('@/workers/solvePuzzleNew.ts', import.meta.url), {
    type: 'module',
  });
  const solvedGrid = ref<SudokuGrid>({});
  const solutionStatus = ref<SolutionStatus>();

  function solve(puzzle: SudokuGrid) {
    worker.postMessage(puzzle);
    solutionStatus.value = 'solving';
  }

  function terminateWorker() {
    worker.terminate();
  }

  worker.onmessage = (e) => {
    if (e.data === 'error') {
      solutionStatus.value = 'failed';
      return;
    }
    solvedGrid.value = e.data;
    solutionStatus.value = 'solved';
    console.log('Puzzle Solved!');
  };

  return {
    solvedGrid,
    solutionStatus,
    solve,
    terminateWorker,
  };
}
