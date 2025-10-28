import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Home from '../pages/Home.vue';
import PollsList from '../pages/PollsList.vue';
import PollDetail from '../pages/PollDetail.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/polls', name: 'Polls', component: PollsList },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/poll/:id', name: 'PollDetail', component: PollDetail, props: true },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;