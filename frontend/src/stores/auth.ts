import { defineStore } from 'pinia';
import api from '../api';
import { ref } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null as null | { id: number; email: string; username: string; firstName?: string; lastName?: string });
  const token = ref<string | null>(localStorage.getItem('token'));

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

  async function register(email: string, password: string, firstName?: string, lastName?: string) {
    const payload: any = { email, password };
    if (firstName) payload.firstName = firstName;
    if (lastName) payload.lastName = lastName;
    
    await api.post('/auth/register', payload);

    // After successful registration, automatically log in
    return login(email, password);
  }

  async function loadProfile() {
    if (!token.value) return null;
    const p = await api.get('/auth/profile');
    user.value = p.data;
    return user.value;
  }

  function logout() {
    setToken(null);
    user.value = null;
  }

  return { user, token, login, register, loadProfile, logout };
});
