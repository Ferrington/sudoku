<script setup lang="ts">
import StringCoords from '@/components/demos/StringCoords.vue';
import TableGeneration from '@/components/demos/TableGeneration.vue';
import { useGlobalInputs } from '@/composables/globalInputs';
import Menu from 'primevue/menu';
import Panel from 'primevue/panel';
import { ref } from 'vue';

useGlobalInputs();

const selectedMenu = ref(0);

const demos = ['Coordinates From String', 'Look Up Table Generation'];

const menuItems = ref(
  demos.map((demo, i) => {
    return {
      label: demo,
      command() {
        selectedMenu.value = i;
      },
    };
  })
);
</script>

<template>
  <div class="wrapper">
    <Menu :model="menuItems" />
    <Panel :header="demos[selectedMenu]">
      <StringCoords v-if="selectedMenu === 0" />
      <TableGeneration v-else-if="selectedMenu === 1" />
    </Panel>
  </div>
</template>

<style scoped>
.wrapper {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 50px;
  padding: 50px;
  align-items: flex-start;
}

.wrapper :deep(.p-menu) {
  width: fit-content;
}
</style>
