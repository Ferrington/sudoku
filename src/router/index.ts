import DemoView from '@/views/DemoView.vue';
import GameView from '@/views/GameView.vue';
import { createRouter as _createRouter, createWebHashHistory } from 'vue-router';

const routes = [
  { path: '/', name: 'game', component: GameView },
  { path: '/demo', name: 'demo', component: DemoView },
];

export function createRouter() {
  return _createRouter({
    history: createWebHashHistory('/sudoku/'),
    routes,
  });
}
