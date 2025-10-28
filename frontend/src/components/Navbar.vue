<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">Votely</router-link>
      <div class="nav-links">
        <router-link to="/polls" class="nav-link">Polls</router-link>
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
  background: #FFFFFF;
  border-bottom: 2px solid rgba(30, 49, 133, 0.1);
  padding: 1.2rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 20px rgba(30, 49, 133, 0.08);
  backdrop-filter: blur(10px);
}

.nav-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand {
  font-size: 2rem;
  font-weight: 800;
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-decoration: none;
  transition: all 0.3s ease;
  letter-spacing: -0.5px;
}

.nav-brand:hover {
  text-decoration: none;
  transform: scale(1.05);
}

.nav-links {
  display: flex;
  gap: 1.5rem;
  align-items: center;
}

.nav-link {
  color: #1E3185;
  text-decoration: none;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.nav-link::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(30, 49, 133, 0.1), transparent);
  transition: left 0.5s ease;
}

.nav-link:hover::before {
  left: 100%;
}

.nav-link:hover {
  background: linear-gradient(135deg, rgba(30, 49, 133, 0.1) 0%, rgba(30, 49, 133, 0.05) 100%);
  color: #1E3185;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(30, 49, 133, 0.2);
}

.nav-link.router-link-active {
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
  color: #FFFFFF;
  box-shadow: 0 4px 15px rgba(30, 49, 133, 0.3);
}

.nav-user {
  color: rgba(30, 49, 133, 0.8);
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0.75rem 1.5rem;
  background: rgba(30, 49, 133, 0.05);
  border-radius: 25px;
  border: 1px solid rgba(30, 49, 133, 0.1);
}

.logout-btn {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: inherit;
  font-weight: 600;
  padding: 0.75rem 1.5rem;
  border-radius: 25px;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.logout-btn:hover {
  background: linear-gradient(135deg, #c82333 0%, #bd2130 100%);
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(220, 53, 69, 0.3);
}

@media (max-width: 768px) {
  .nav-container {
    padding: 0 1rem;
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-brand {
    font-size: 1.5rem;
  }
  
  .nav-links {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-link {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>
