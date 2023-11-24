<script setup lang="ts">
import { useSolve } from '@/composables/solve';
import type { SudokuGrid } from '@/types';
import { generateBoardFromString } from '@/utils/generateBoard';
import Button from 'primevue/button';
import Divider from 'primevue/divider';
import InlineMessage from 'primevue/inlinemessage';
import InputText from 'primevue/inputtext';
import { onUnmounted, ref, toRaw, watch } from 'vue';

defineEmits(['newGame', 'importGame']);

const importTooltip =
  'A valid import string is 81 characters long. ' +
  'Any non-numeric character or 0 can be used for blank cells.\n ' +
  "Ex:\n '_1_23_...'\n '010230...'";
const { solvedGrid, solutionStatus, solve, terminateWorker } = useSolve();

const sudokuGrid = ref<SudokuGrid>();
const puzzleString = ref('');
const checkingImport = ref(false);
const status = ref({
  severity: 'info',
  message: '',
});

function testFunc() {
  if (puzzleString.value.trim().length === 0) {
    status.value.message = '';
    return;
  } else if (puzzleString.value.trim().length !== 81) {
    status.value.severity = 'error';
    status.value.message = 'Import string is not 81 characters long.';
    return;
  }

  checkingImport.value = true;
  status.value.severity = 'info';
  status.value.message = 'Checking puzzle.';
  const puzzle = generateBoardFromString(puzzleString.value.trim());
  sudokuGrid.value = puzzle;
  solve(puzzle);
}

watch(solutionStatus, (solutionStatus) => {
  if (solutionStatus === 'solved') {
    status.value.severity = 'success';
    status.value.message = 'Puzzle is valid!';
    checkingImport.value = false;
  } else if (solutionStatus === 'failed') {
    status.value.severity = 'error';
    status.value.message = 'Puzzle is not valid.';
    checkingImport.value = false;
  }
});

onUnmounted(terminateWorker);
</script>

<template>
  <div class="modal-wrapper">
    <span class="p-buttonset">
      <Button label="Easy" @click="$emit('newGame', 'easy')" />
      <Button label="Medium" @click="$emit('newGame', 'medium')" />
      <Button label="Hard" @click="$emit('newGame', 'hard')" />
      <Button label="Expert" @click="$emit('newGame', 'expert')" />
    </span>
    <Divider />
    <div class="import-wrapper">
      <InputText
        class="puzzle-input"
        type="text"
        v-model="puzzleString"
        v-tooltip.bottom="{
          value: importTooltip,
          fitContent: true,
        }"
        @input="testFunc"
      />
      <Button
        label="Import"
        icon="pi pi-file-import"
        :loading="checkingImport"
        :disabled="status.severity !== 'success' && !checkingImport"
        @click="$emit('importGame', toRaw(sudokuGrid), toRaw(solvedGrid))"
      />
    </div>
    <InlineMessage v-if="status.message" class="status" :severity="status.severity">{{
      status.message
    }}</InlineMessage>
  </div>
</template>

<style scoped>
.p-buttonset .p-button + .p-button {
  border-left: 1px solid white;
}

.import-wrapper {
  display: flex;
  gap: 5px;
}

.puzzle-input {
  flex-grow: 1;
}

.status {
  margin-top: 10px;
  width: 100%;
}
</style>
