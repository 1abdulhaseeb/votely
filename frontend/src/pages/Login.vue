<template>
  <div class="page">
    <h2>Login</h2>
    <form @submit.prevent="handleLogin">
      <input 
        v-model="email" 
        placeholder="Email" 
        type="email" 
        required 
      />
      <input 
        v-model="password" 
        placeholder="Password" 
        type="password" 
        required 
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Logging in...' : 'Login' }}
      </button>
    </form>
    <p>
      Don't have an account?
      <router-link to="/register">Register here</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const email = ref('');
const password = ref('');
const loading = ref(false);
const auth = useAuthStore();
const router = useRouter();

async function handleLogin() {
  if (loading.value) return;
  
  loading.value = true;
  try {
    await auth.login(email.value, password.value);
    router.push('/');
  } catch (e: any) {
    const message = e?.response?.data?.message || 'Login failed';
    alert(message);
  } finally {
    loading.value = false;
  }
}
</script>
