<template>
  <div class="page">
    <h2>Register</h2>
    <form @submit.prevent="handleRegister">
      <input 
        v-model="formData.email" 
        placeholder="Email" 
        type="email" 
        required 
      />
      <input 
        v-model="formData.password" 
        placeholder="Password" 
        type="password" 
        required 
        minlength="6"
      />
      <input 
        v-model="formData.firstName" 
        placeholder="First Name (optional)" 
      />
      <input 
        v-model="formData.lastName" 
        placeholder="Last Name (optional)" 
      />
      <button type="submit" :disabled="loading">
        {{ loading ? 'Registering...' : 'Register' }}
      </button>
    </form>
    <p>
      Already have an account?
      <router-link to="/login">Login here</router-link>
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';

const formData = reactive({
  email: '',
  password: '',
  firstName: '',
  lastName: ''
});

const loading = ref(false);
const auth = useAuthStore();
const router = useRouter();

async function handleRegister() {
  if (loading.value) return;
  
  loading.value = true;
  try {
    await auth.register(
      formData.email, 
      formData.password, 
      formData.firstName || undefined, 
      formData.lastName || undefined
    );
    // Redirect to home page after successful registration
    router.push('/');
  } catch (e: any) {
    const message = e?.response?.data?.message || 'Registration failed';
    alert(message);
  } finally {
    loading.value = false;
  }
}
</script>