import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './style.css'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Initialize auth store after Pinia is set up
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()
authStore.initializeAuth()

app.mount('#app')
