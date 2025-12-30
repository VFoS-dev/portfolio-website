<template>
  <div class="change-password-view">
    <h1>Change Password</h1>
    
    <div v-if="loading" class="loading">Processing...</div>
    <div v-if="error" class="error">{{ error }}</div>
    <div v-if="success" class="success">{{ success }}</div>

    <div class="form-container">
      <form @submit.prevent="handleChangePassword">
        <div class="form-group">
          <label>Current Password:</label>
          <input 
            v-model="currentPassword" 
            type="password" 
            required 
            autocomplete="current-password"
            :disabled="loading"
          />
        </div>
        <div class="form-group">
          <label>New Password:</label>
          <input 
            v-model="newPassword" 
            type="password" 
            required 
            autocomplete="new-password"
            :disabled="loading"
            minlength="6"
          />
        </div>
        <div class="form-group">
          <label>Confirm New Password:</label>
          <input 
            v-model="confirmPassword" 
            type="password" 
            required 
            autocomplete="new-password"
            :disabled="loading"
            minlength="6"
          />
        </div>
        <div v-if="newPassword && confirmPassword && newPassword !== confirmPassword" class="error">
          Passwords do not match
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="loading || newPassword !== confirmPassword">
            {{ loading ? 'Changing Password...' : 'Change Password' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import apiService from '@/services/api'

const currentPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const loading = ref(false)
const error = ref(null)
const success = ref(null)

const handleChangePassword = async () => {
  if (newPassword.value !== confirmPassword.value) {
    error.value = 'Passwords do not match'
    return
  }

  if (newPassword.value.length < 6) {
    error.value = 'Password must be at least 6 characters long'
    return
  }

  loading.value = true
  error.value = null
  success.value = null

  try {
    const response = await apiService.changePassword({
      currentPassword: currentPassword.value,
      newPassword: newPassword.value,
    })

    if (response.status === 200) {
      success.value = 'Password changed successfully!'
      currentPassword.value = ''
      newPassword.value = ''
      confirmPassword.value = ''
    } else {
      error.value = response.message || 'Failed to change password'
    }
  } catch (err) {
    error.value = err.message || 'Error changing password'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.change-password-view {
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  background: var(--color-background);
  color: var(--color-text);
  min-height: calc(100vh - 100px);
}

.change-password-view h1 {
  color: var(--color-heading);
  margin-bottom: 2rem;
  font-size: 2rem;
}

.loading {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 6px;
  background-color: #e7f3ff;
  color: #004085;
  text-align: center;
}

.error {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 6px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}

.success {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 6px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.form-container {
  background: var(--color-background-soft);
  padding: 2rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
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

.form-actions {
  margin-top: 2rem;
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
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>

