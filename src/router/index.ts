import DemoView from '@/views/DemoView.vue';
import GameView from '@/views/GameView.vue';
import { createRouter as _createRouter, createWebHistory } from 'vue-router';

const routes = [
  { path: '/sudoku', name: 'game', component: GameView },
  { path: '/sudoku/demo', name: 'demo', component: DemoView },
];

export function createRouter() {
  return _createRouter({
    history: createWebHistory(),
    routes,
  });
}
