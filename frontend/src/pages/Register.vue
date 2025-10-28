<template>
  <div class="register-page">
    <div class="register-container">
      <div class="register-card">
        <div class="register-header">
          <div class="register-icon">🚀</div>
          <h2>Join Votely</h2>
          <p>Create your account and start polling</p>
        </div>
        
        <form @submit.prevent="handleRegister" class="register-form">
          <div class="input-group">
            <label for="email">Email Address</label>
            <input 
              id="email"
              v-model="formData.email" 
              placeholder="Enter your email" 
              type="email" 
              required 
            />
          </div>
          
          <div class="input-group">
            <label for="password">Password</label>
            <input 
              id="password"
              v-model="formData.password" 
              placeholder="Create a strong password" 
              type="password" 
              required 
              minlength="6"
            />
            <small class="input-hint">Minimum 6 characters</small>
          </div>
          
          <div class="name-row">
            <div class="input-group">
              <label for="firstName">First Name</label>
              <input 
                id="firstName"
                v-model="formData.firstName" 
                placeholder="First name (optional)" 
              />
            </div>
            
            <div class="input-group">
              <label for="lastName">Last Name</label>
              <input 
                id="lastName"
                v-model="formData.lastName" 
                placeholder="Last name (optional)" 
              />
            </div>
          </div>
          
          <button type="submit" :disabled="loading" class="register-btn">
            <span v-if="loading" class="loading-spinner"></span>
            {{ loading ? 'Creating Account...' : 'Create Account' }}
          </button>
        </form>
        
        <div class="register-footer">
          <p>
            Already have an account?
            <router-link to="/login" class="login-link">Sign in here</router-link>
          </p>
        </div>
      </div>
    </div>
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

<style scoped>
.register-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #FFFFFF 0%, #f8f9ff 50%, #FFFFFF 100%);
  padding: 2rem 1rem;
  position: relative;
}

.register-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: radial-gradient(circle at 20% 30%, rgba(30, 49, 133, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 80% 70%, rgba(30, 49, 133, 0.05) 0%, transparent 50%);
  pointer-events: none;
}

.register-container {
  width: 100%;
  max-width: 520px;
  position: relative;
  z-index: 1;
}

.register-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 3rem;
  box-shadow: 0 20px 40px rgba(30, 49, 133, 0.15);
  border: 1px solid rgba(30, 49, 133, 0.1);
  position: relative;
  overflow: hidden;
}

.register-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
}

.register-header {
  text-align: center;
  margin-bottom: 2.5rem;
}

.register-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  display: block;
}

.register-header h2 {
  color: #1E3185;
  font-size: 2.2rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
}

.register-header p {
  color: rgba(30, 49, 133, 0.7);
  font-size: 1.1rem;
}

.register-form {
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;
}

.name-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.name-row .input-group {
  margin-bottom: 1.5rem;
}

.input-group label {
  display: block;
  color: #1E3185;
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.input-group input {
  width: 100%;
  padding: 1rem 1.5rem;
  border: 2px solid rgba(30, 49, 133, 0.15);
  border-radius: 12px;
  font-size: 1rem;
  color: #1E3185;
  background: #FFFFFF;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.input-group input::placeholder {
  color: rgba(30, 49, 133, 0.4);
}

.input-group input:focus {
  outline: none;
  border-color: #1E3185;
  box-shadow: 0 0 0 3px rgba(30, 49, 133, 0.15);
  transform: translateY(-2px);
}

.input-hint {
  display: block;
  color: rgba(30, 49, 133, 0.6);
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-style: italic;
}

.register-btn {
  width: 100%;
  padding: 1.2rem;
  background: linear-gradient(135deg, #1E3185 0%, #2940a0 100%);
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  position: relative;
  overflow: hidden;
}

.register-btn::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.6s ease;
}

.register-btn:hover::before {
  left: 100%;
}

.register-btn:hover {
  background: linear-gradient(135deg, #162661 0%, #1E3185 100%);
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(30, 49, 133, 0.4);
}

.register-btn:active {
  transform: translateY(0);
}

.register-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
  transform: none;
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid #FFFFFF;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.register-footer {
  text-align: center;
  padding-top: 1.5rem;
  border-top: 1px solid rgba(30, 49, 133, 0.1);
}

.register-footer p {
  color: rgba(30, 49, 133, 0.7);
  font-size: 0.95rem;
}

.login-link {
  color: #1E3185;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
}

.login-link:hover {
  color: #162661;
  text-decoration: underline;
}

/* Responsive Design */
@media (max-width: 600px) {
  .name-row {
    grid-template-columns: 1fr;
    gap: 0;
  }
}

@media (max-width: 480px) {
  .register-card {
    padding: 2rem 1.5rem;
    margin: 1rem;
  }
  
  .register-header h2 {
    font-size: 1.8rem;
  }
  
  .register-btn {
    padding: 1rem;
    font-size: 1rem;
  }
}
</style>