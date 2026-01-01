<template>
  <div class="login-view">
    <div class="login-container">
      <h1>Portfolio Admin</h1>
      <h2>Sign In</h2>
      
      <ErrorMessage :error="error" />
      
      <form @submit.prevent="handleLogin" class="login-form">
        <FormGroup label="Username:">
          <input 
            v-model="username" 
            type="text" 
            required 
            autocomplete="username"
            :disabled="loading"
          />
        </FormGroup>
        <FormGroup label="Password:">
          <input 
            v-model="password" 
            type="password" 
            required 
            autocomplete="current-password"
            :disabled="loading"
          />
        </FormGroup>
        <Button type="submit" variant="primary" :disabled="loading" class="login-button">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </Button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import apiService from '@/services/api'
import { useAuthStore } from '@/stores/auth'
import ErrorMessage from '@/components/ErrorMessage.vue'
import FormGroup from '@/components/FormGroup.vue'
import Button from '@/components/Button.vue'

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

.login-form {
  display: flex;
  flex-direction: column;
}

.login-button {
  width: 100%;
  margin-top: 0.5rem;
}
</style>
