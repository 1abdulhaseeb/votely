<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">Votely</router-link>
      <div class="nav-links">
        <router-link to="/" class="nav-link">Polls</router-link>
        <template v-if="auth.user">
          <span class="nav-user">Welcome, {{ auth.user.firstName || auth.user.username || auth.user.email }}!</span>
          <button @click="handleLogout" class="nav-link logout-btn">Logout</button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register" class="nav-link">Register</router-link>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();

onMounted(async () => {
  // Try to load user profile if token exists
  if (auth.token) {
    try {
      await auth.loadProfile();
    } catch (e) {
      // Token might be expired, clear it
      auth.logout();
    }
  }
});

function handleLogout() {
  auth.logout();
  router.push('/login');
}
</script>

<style scoped>
.navbar {
  background: #fff;
  border-bottom: 1px solid #e9ecef;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 1.5rem;
  font-weight: bold;
  color: #007bff;
  text-decoration: none;
}

.nav-brand:hover {
  text-decoration: none;
  color: #0056b3;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.2s;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #007bff;
}

.nav-link.router-link-active {
  color: #007bff;
  background-color: #e7f3ff;
}

.nav-user {
  color: #666;
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
}

.logout-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  font-weight: 500;
}

.logout-btn:hover {
  background-color: #fee;
  color: #dc3545;
}
</style>
