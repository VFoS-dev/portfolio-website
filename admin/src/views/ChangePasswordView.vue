<template>
  <div class="change-password-view">
    <h1>Change Password</h1>
    
    <LoadingState :loading="loading" message="Processing..." />
    <ErrorMessage :error="error" />
    <SuccessMessage :message="success" />

    <FormContainer>
      <form @submit.prevent="handleChangePassword">
        <FormGroup label="Current Password:">
          <input 
            v-model="currentPassword" 
            type="password" 
            required 
            autocomplete="current-password"
            :disabled="loading"
          />
        </FormGroup>
        <FormGroup label="New Password:">
          <input 
            v-model="newPassword" 
            type="password" 
            required 
            autocomplete="new-password"
            :disabled="loading"
            minlength="6"
          />
        </FormGroup>
        <FormGroup label="Confirm New Password:">
          <input 
            v-model="confirmPassword" 
            type="password" 
            required 
            autocomplete="new-password"
            :disabled="loading"
            minlength="6"
          />
        </FormGroup>
        <ErrorMessage v-if="newPassword && confirmPassword && newPassword !== confirmPassword" error="Passwords do not match" />
        <FormActions>
          <Button 
            type="submit" 
            variant="primary" 
            :disabled="loading || (newPassword && confirmPassword && newPassword !== confirmPassword)"
          >
            {{ loading ? 'Changing Password...' : 'Change Password' }}
          </Button>
        </FormActions>
      </form>
    </FormContainer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import apiService from '@/services/api'
import LoadingState from '@/components/LoadingState.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import SuccessMessage from '@/components/SuccessMessage.vue'
import FormContainer from '@/components/FormContainer.vue'
import FormGroup from '@/components/FormGroup.vue'
import FormActions from '@/components/FormActions.vue'
import Button from '@/components/Button.vue'

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
</style>
