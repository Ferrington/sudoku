import { useSelectedStore } from '@/stores/selected';
import { storeToRefs } from 'pinia';
import { computed } from 'vue';

export function useSelectCell(coordsString: string) {
  const selectedStore = useSelectedStore();
  const { setSelected, appendSelected } = selectedStore;
  const { selectedCells } = storeToRefs(selectedStore);

  const isSelected = computed((): Boolean => {
    return selectedCells.value.some((cs) => cs === coordsString);
  });

  return {
    isSelected,
    setSelected,
    appendSelected,
  };
}
