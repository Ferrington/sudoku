import type { SudokuGrid } from '@/types';
import { defineStore } from 'pinia';
import { computed, ref, toRaw } from 'vue';

export const useHistoryStore = defineStore('history', () => {
  const history = ref<SudokuGrid[]>([]);
  const index = ref(-1);

  const cannotUndo = computed(() => index.value < 1);

  const cannotRedo = computed(() => index.value + 1 >= history.value.length);

  function addSnapshot(grid: SudokuGrid) {
    const deepClone = structuredClone(toRaw(grid));
    if (index.value + 1 < history.value.length) pruneTimeline();
    history.value.push(deepClone);
    if (history.value.length > 10) history.value.shift();
    else index.value++;
  }

  function prevSnapshot() {
    if (cannotUndo.value) return;
    return structuredClone(toRaw(history.value[--index.value]));
  }

  function nextSnapshot() {
    if (cannotRedo.value) return;
    return structuredClone(toRaw(history.value[++index.value]));
  }

  function pruneTimeline() {
    history.value = history.value.slice(0, index.value + 1);
  }

  return {
    history,
    addSnapshot,
    prevSnapshot,
    nextSnapshot,
    cannotUndo,
    cannotRedo,
  };
});
