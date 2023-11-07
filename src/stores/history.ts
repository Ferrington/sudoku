import type { SudokuGrid } from '@/types';
import { defineStore } from 'pinia';
import { ref, toRaw } from 'vue';

export const useHistoryStore = defineStore('history', () => {
  const history = ref<SudokuGrid[]>([]);

  function addSnapshot(grid: SudokuGrid) {
    const deepClone = structuredClone(toRaw(grid));
    history.value.push(deepClone);
    if (history.value.length > 10) history.value.shift();
  }

  function prevSnapshot() {
    if (history.value.length === 1) return;
    history.value.pop();
    return structuredClone(toRaw(history.value.slice(-1)[0]));
  }

  return {
    history,
    addSnapshot,
    prevSnapshot,
  };
});
