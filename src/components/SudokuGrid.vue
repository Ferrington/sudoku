<script setup lang="ts">
import { BOARD_SIZE, BOX_SIZE } from '@/constants';
import SudokuCell from './SudokuCell.vue';
</script>

<template>
  <div class="board">
    <div class="board-wrapper">
      <div class="box" v-for="i in BOARD_SIZE" :key="i">
        <SudokuCell v-for="j in BOARD_SIZE" :key="j" :boxNumber="i - 1" :cellNumber="j - 1" />
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
  gap: 2px;
  padding: 1px;
}

.box {
  display: grid;
  grid-template-columns: repeat(v-bind(BOX_SIZE), auto);
  gap: 1px;
}
</style>
@/constants/constants
