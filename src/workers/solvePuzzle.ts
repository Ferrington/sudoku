import { solvePuzzle } from '@/utils/solvePuzzle';

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
