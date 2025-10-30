import { defineStore } from 'pinia';
import api from '../api';
import { ref } from 'vue';
import type { User } from '../api/services';

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null);
  const token = ref<string | null>(localStorage.getItem('token'));
  const initialized = ref<boolean>(false);

  function setToken(t: string | null) {
    token.value = t;
    if (t) localStorage.setItem('token', t);
    else localStorage.removeItem('token');
  }

  async function login(email: string, password: string) {
    const response = await api.post('/auth/login', { email, password });
    setToken(response.data.access_token);

    // fetch profile
    return setUser();
  }

  async function setUser() {
    const response = await api.get('/auth/profile');
    user.value = response.data;
    return user.value;
  }

  async function register(data: {
    email: string;
    username: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role?: 'voter' | 'candidate' | 'admin';
  }) {
    await api.post('/auth/register', data);

    // After successful registration, automatically log in
    return login(data.email, data.password);
  }

  async function loadProfile() {
    if (!token.value) return null;
    const p = await api.get('/auth/profile');
    user.value = p.data;
    return user.value;
  }

  async function initializeAuth() {
    if (initialized.value) return;
    
    if (token.value) {
      try {
        await loadProfile();
      } catch (error) {
        // Token might be invalid, clear it
        logout();
      }
    }
    initialized.value = true;
  }

  function logout() {
    setToken(null);
    user.value = null;
  }

  return { user, token, initialized, login, register, loadProfile, initializeAuth, logout };
});
