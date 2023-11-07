import type { SudokuGrid } from '@/types';
import { defineStore } from 'pinia';
import { ref, toRaw } from 'vue';

export const useHistoryStore = defineStore('history', () => {
  const history = ref<SudokuGrid[]>([]);
  const index = ref(-1);

  function addSnapshot(grid: SudokuGrid) {
    const deepClone = structuredClone(toRaw(grid));
    if (history.value.length - 1 > index.value) pruneTimeline();
    history.value.push(deepClone);
    if (history.value.length > 10) history.value.shift();
    else index.value++;
  }

  function prevSnapshot() {
    if (index.value < 1 || history.value.length === 1) return;
    return structuredClone(toRaw(history.value[--index.value]));
  }

  function nextSnapshot() {
    if (index.value + 1 > history.value.length) return;
    index.value += 2;
    return structuredClone(toRaw(history.value[index.value]));
  }

  function pruneTimeline() {
    history.value = history.value.slice(0, index.value + 1);
  }

  return {
    history,
    addSnapshot,
    prevSnapshot,
    nextSnapshot,
  };
});
