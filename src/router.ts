import { createRouter, createWebHistory } from 'vue-router';
import PlatformView from './views/PlatformView.vue';
import GameView from './views/GameView.vue';
import CreateSessionView from './views/CreateSessionView.vue';

const routes = [
  { 
    path: '/',
    component: PlatformView,
    children: [
      {
        name: 'createSession',
        path: '',
        component: CreateSessionView
      },
      {
        name: 'game',
        path: '/sessionId/:sessionId',
        component: GameView,
      },
    ],
  },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;