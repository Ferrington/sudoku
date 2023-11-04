import type { Menu } from '@/types';
import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useMenuStore = defineStore('menu', () => {
  const activeMenu = ref<Menu>('digit');

  function setActiveMenu(menu: Menu) {
    activeMenu.value = menu;
  }

  return {
    activeMenu,
    setActiveMenu,
  };
});
