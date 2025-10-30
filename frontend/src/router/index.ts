import { createRouter, createWebHistory } from 'vue-router';
import Login from '../pages/Login.vue';
import Register from '../pages/Register.vue';
import Home from '../pages/Home.vue';
import PollsList from '../pages/PollsList.vue';
import PollDetail from '../pages/PollDetail.vue';
import CreatePoll from '../pages/CreatePoll.vue';
import AdminDashboard from '../pages/AdminDashboard.vue';
import CandidateDashboard from '../pages/CandidateDashboard.vue';
import UserManagement from '../pages/UserManagement.vue';

const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/polls', name: 'Polls', component: PollsList },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/poll/:id', name: 'PollDetail', component: PollDetail, props: true },
  { path: '/create-poll', name: 'CreatePoll', component: CreatePoll, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin', name: 'AdminDashboard', component: AdminDashboard, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/admin/users', name: 'UserManagement', component: UserManagement, meta: { requiresAuth: true, requiresAdmin: true } },
  { path: '/candidate', name: 'CandidateDashboard', component: CandidateDashboard, meta: { requiresAuth: true, requiresCandidate: true } },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guards
router.beforeEach(async (to, from, next) => {
  // Import auth store dynamically to avoid circular dependencies
  const { useAuthStore } = await import('../stores/auth');
  const authStore = useAuthStore();

  // Check if route requires authentication
  if (to.meta.requiresAuth) {
    // Initialize auth if not already done
    if (!authStore.initialized) {
      await authStore.initializeAuth();
    }

    // Check if user is authenticated
    if (!authStore.user) {
      next('/login');
      return;
    }

    // Check admin requirement
    if (to.meta.requiresAdmin && authStore.user.role !== 'admin') {
      console.warn('Access denied: Admin role required');
      next('/');
      return;
    }

    // Check candidate requirement
    if (to.meta.requiresCandidate && authStore.user.role !== 'candidate') {
      console.warn('Access denied: Candidate role required');
      next('/');
      return;
    }
  }

  next();
});

export default router;