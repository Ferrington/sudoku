import type { SudokuGrid } from '@/types';
import type { Ref } from 'vue';
import { computed, ref, toRaw, watch } from 'vue';

export function useHistory(sudokuGrid: Ref<SudokuGrid>) {
  // state
  const history = ref<SudokuGrid[]>([]);
  const index = ref(-1);
  const preventUpdate = ref(false);

  // computed
  const cannotUndo = computed(() => index.value < 1);
  const cannotRedo = computed(() => index.value + 1 >= history.value.length);

  // actions
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

  function undo() {
    // const prev = prevSnapshot();
    // if (prev == null) return;
    // preventUpdate.value = true;
    // sudokuGrid.value = prev;
  }

  function redo() {
    // const next = nextSnapshot();
    // if (next == null) return;
    // preventUpdate.value = true;
    // sudokuGrid.value = next;
  }

  // watchers
  watch(
    sudokuGrid,
    (grid) => {
      if (preventUpdate.value) {
        preventUpdate.value = false;
        return;
      }
      addSnapshot(grid);
    },
    { immediate: true, deep: true }
  );

  return {
    undo,
    redo,
    cannotUndo,
    cannotRedo,
  };
}
