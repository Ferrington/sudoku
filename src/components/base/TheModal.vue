<script setup lang="ts"></script>

<template>
  <aside class="background" @click="$emit('close')">
    <div class="modal" @click.stop>
      <slot />
    </div>
  </aside>
</template>

<style scoped>
.background {
  position: absolute;
  inset: 0px;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  padding: 40px 50px;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}
</style>
