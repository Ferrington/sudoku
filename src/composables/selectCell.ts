import { useSelectedStore } from '@/stores/selected';
import { storeToRefs } from 'pinia';
import { computed, type ComputedRef } from 'vue';

export function useSelectCell(coordsString: ComputedRef<string>) {
  const selectedStore = useSelectedStore();
  const { setSelected, appendSelected } = selectedStore;
  const { selectedCells } = storeToRefs(selectedStore);

  const isSelected = computed((): Boolean => {
    return selectedCells.value.some((cs) => cs === coordsString.value);
  });

  return {
    isSelected,
    setSelected,
    appendSelected,
  };
}
