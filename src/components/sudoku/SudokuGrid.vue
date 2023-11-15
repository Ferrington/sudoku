<script setup lang="ts">
import SudokuCell from '@/components/sudoku/SudokuCell.vue';
import { BOARD_SIZE, BOX_SIZE } from '@/constants';
import { useSudokuGridStore } from '@/stores/sudokuGrid';
import { storeToRefs } from 'pinia';

const store = useSudokuGridStore();
const { sudokuGrid } = storeToRefs(store);
</script>

<template>
  <div class="board">
    <div class="board-wrapper">
      <div class="box" v-for="i in BOARD_SIZE" :key="i">
        <template v-if="Object.keys(sudokuGrid).length > 0">
          <SudokuCell v-for="j in BOARD_SIZE" :key="j" :boxNumber="i - 1" :cellNumber="j - 1" />
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.board {
  display: inline-block;
  background: black;
  user-select: none;
}
.board-wrapper {
  display: grid;
  grid-template-columns: repeat(v-bind(BOX_SIZE), auto);
  gap: 4px;
  padding: 4px;
}

.box {
  display: grid;
  grid-template-columns: repeat(v-bind(BOX_SIZE), auto);
  gap: 1px;
}
</style>
@/constants/constants
