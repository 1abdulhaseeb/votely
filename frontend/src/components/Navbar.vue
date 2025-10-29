<template>
  <nav class="navbar">
    <div class="nav-container">
      <router-link to="/" class="nav-brand">Votely</router-link>
      <div class="nav-links">
        <router-link to="/polls" class="nav-link">Polls</router-link>
        
        <!-- Admin Navigation -->
        <template v-if="auth.user?.role === 'admin'">
          <router-link to="/admin" class="nav-link admin-link">Admin</router-link>
          <router-link to="/create-poll" class="nav-link create-link">Create Poll</router-link>
        </template>
        
        <!-- Candidate Navigation -->
        <template v-if="auth.user?.role === 'candidate'">
          <router-link to="/candidate" class="nav-link candidate-link">My Dashboard</router-link>
        </template>
        
        <template v-if="auth.user">
          <div class="user-menu">
            <div class="user-info">
              <span class="user-name">{{ displayName }}</span>
              <span class="user-role" :class="auth.user.role">{{ roleDisplay }}</span>
            </div>
            <button @click="handleLogout" class="logout-btn">Logout</button>
          </div>
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
import { onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const auth = useAuthStore();
const router = useRouter();

// Computed properties
const displayName = computed(() => {
  if (!auth.user) return '';
  return auth.user.firstName || auth.user.username || auth.user.email;
});

const roleDisplay = computed(() => {
  if (!auth.user || !auth.user.role) return '';
  const role = auth.user.role;
  return role.charAt(0).toUpperCase() + role.slice(1);
});

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

.admin-link {
  background: linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%);
  color: white;
}

.admin-link:hover {
  background: linear-gradient(135deg, #6d28d9 0%, #5b21b6 100%);
}

.create-link {
  background: linear-gradient(135deg, #059669 0%, #047857 100%);
  color: white;
}

.create-link:hover {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
}

.candidate-link {
  background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
  color: white;
}

.candidate-link:hover {
  background: linear-gradient(135deg, #b45309 0%, #92400e 100%);
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-info {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding: 0.5rem 1rem;
  background: rgba(30, 49, 133, 0.05);
  border-radius: 12px;
  border: 1px solid rgba(30, 49, 133, 0.1);
}

.user-name {
  color: #1E3185;
  font-weight: 600;
  font-size: 0.9rem;
}

.user-role {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  margin-top: 0.2rem;
}

.user-role.admin {
  background: #7c3aed;
  color: white;
}

.user-role.candidate {
  background: #d97706;
  color: white;
}

.user-role.voter {
  background: #059669;
  color: white;
}

.logout-btn {
  background: linear-gradient(135deg, #dc3545 0%, #c82333 100%);
  color: #FFFFFF;
  border: none;
  cursor: pointer;
  font-family: inherit;
  font-size: 0.9rem;
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

@media (max-width: 968px) {
  .nav-container {
    padding: 0 1rem;
  }
  
  .nav-links {
    gap: 0.75rem;
  }
  
  .nav-link {
    padding: 0.6rem 1rem;
    font-size: 0.85rem;
  }
  
  .user-info {
    padding: 0.4rem 0.8rem;
  }
  
  .user-name {
    font-size: 0.8rem;
  }
  
  .user-role {
    font-size: 0.7rem;
  }
}

@media (max-width: 768px) {
  .nav-container {
    flex-direction: column;
    gap: 1rem;
  }
  
  .nav-brand {
    font-size: 1.5rem;
  }
  
  .nav-links {
    gap: 0.5rem;
    flex-wrap: wrap;
    justify-content: center;
  }
  
  .nav-link {
    padding: 0.5rem 0.8rem;
    font-size: 0.8rem;
  }
  
  .user-menu {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .user-info {
    text-align: center;
    align-items: center;
  }
}
</style>
