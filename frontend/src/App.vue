<template>
  <div id="app">
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
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from './stores/auth';

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

<style>
/* Reset some default styles */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: system-ui, -apple-system, sans-serif;
  background-color: #f8f9fa;
  color: #333;
  margin: 0;
  display: block;
  min-height: 100vh;
}

#app {
  max-width: none;
  margin: 0;
  padding: 0;
  text-align: left;
}

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

.main-content {
  min-height: calc(100vh - 80px);
  padding: 2rem 0;
}

/* Page styles */
.page {
  max-width: 800px;
  margin: 0 auto;
  padding: 0 1rem;
}

/* Form styles */
form {
  max-width: 400px;
  margin: 2rem auto;
  padding: 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

form input {
  width: 100%;
  padding: 0.75rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

form input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 2px rgba(0,123,255,0.25);
}

form button {
  width: 100%;
  padding: 0.75rem;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;
}

form button:hover {
  background-color: #0056b3;
}

/* Override dark theme */
:root {
  color-scheme: light;
  color: #333;
  background-color: #ffffff;
}

a {
  color: #007bff;
  text-decoration: none;
}

a:hover {
  color: #0056b3;
  text-decoration: underline;
}

button {
  background-color: #007bff;
  color: white;
  border: 1px solid #007bff;
}

button:hover {
  background-color: #0056b3;
  border-color: #0056b3;
}
</style>
