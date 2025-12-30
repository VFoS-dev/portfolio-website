<template>
  <div class="login-view">
    <div class="login-container">
      <h1>Portfolio Admin</h1>
      <h2>Sign In</h2>
      
      <div v-if="error" class="error">{{ error }}</div>
      
      <form @submit.prevent="handleLogin" class="login-form">
        <div class="form-group">
          <label>Username:</label>
          <input 
            v-model="username" 
            type="text" 
            required 
            autocomplete="username"
            :disabled="loading"
          />
        </div>
        <div class="form-group">
          <label>Password:</label>
          <input 
            v-model="password" 
            type="password" 
            required 
            autocomplete="current-password"
            :disabled="loading"
          />
        </div>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/api'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const username = ref('')
const password = ref('')
const loading = ref(false)
const error = ref(null)

const handleLogin = async () => {
  loading.value = true
  error.value = null
  
  try {
    const response = await apiService.login({
      username: username.value,
      password: password.value,
    })
    
    if (response.status === 200 && response.data) {
      authStore.setToken(response.data.token)
      authStore.setUser(response.data.user)
      router.push('/')
    } else {
      error.value = response.message || 'Login failed'
    }
  } catch (err) {
    error.value = err.message || 'Error signing in'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  padding: 2rem;
}

.login-container {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 3rem;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.login-container h1 {
  margin: 0 0 0.5rem 0;
  color: var(--color-heading);
  font-size: 2rem;
  text-align: center;
}

.login-container h2 {
  margin: 0 0 2rem 0;
  color: var(--color-text);
  font-size: 1.5rem;
  text-align: center;
  font-weight: normal;
}

.error {
  background-color: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 6px;
  margin-bottom: 1.5rem;
  border: 1px solid #f5c6cb;
}

.login-form {
  display: flex;
  flex-direction: column;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.95rem;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s, box-shadow 0.2s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-group input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-primary {
  background-color: #007bff;
  color: white;
  width: 100%;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

