<template>
  <div class="default-window-view">
    <h1>Default Window Management</h1>
    
    <ActionButtons 
      :show-refresh="true"
      :show-create="false"
      @refresh="loadDefaultWindow"
    />

    <LoadingState :loading="loading" />
    <ErrorMessage :error="error" />

    <FormContainer v-if="editingDefaultWindow" :title="defaultWindow ? 'Edit Default Window' : 'Create Default Window'">
      <form @submit.prevent="handleUpdate">
        <FormGroup label="Icon Title (required):">
          <select v-model="editingDefaultWindow.iconTitle" required>
            <option value="">Select an icon...</option>
            <option v-for="icon in icons" :key="icon._id" :value="icon.title">
              {{ icon.title }}
            </option>
          </select>
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary">{{ defaultWindow ? 'Update' : 'Create' }}</Button>
          <Button v-if="defaultWindow" type="button" variant="secondary" @click="cancelEdit">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <div v-if="defaultWindow" class="default-window-display">
      <div class="display-header">
        <h2>Current Default Window</h2>
        <div class="card-actions">
          <Button variant="warning" size="small" @click="startEdit">Edit</Button>
          <Button 
            :variant="defaultWindow.deactivated ? 'success' : 'warning'" 
            size="small" 
            @click="toggleDeactivated"
          >
            {{ defaultWindow.deactivated ? 'Activate' : 'Deactivate' }}
          </Button>
        </div>
      </div>
      <DeactivatedBadge :is-deactivated="defaultWindow.deactivated" />
      <div class="window-card">
        <p><strong>Icon Title:</strong> {{ defaultWindow.iconTitle }}</p>
      </div>
    </div>
    <NoData v-else-if="!loading" message="No default window found" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/services/api'
import ActionButtons from '@/components/ActionButtons.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import FormContainer from '@/components/FormContainer.vue'
import FormGroup from '@/components/FormGroup.vue'
import FormActions from '@/components/FormActions.vue'
import Button from '@/components/Button.vue'
import DeactivatedBadge from '@/components/DeactivatedBadge.vue'
import NoData from '@/components/NoData.vue'

const defaultWindow = ref(null)
const loading = ref(false)
const error = ref(null)
const editingDefaultWindow = ref(null)
const icons = ref([])
const loadingIcons = ref(false)

const loadIcons = async () => {
  loadingIcons.value = true
  try {
    const response = await apiService.getIcons()
    if (response.status === 200) {
      icons.value = response.data || []
    }
  } catch (err) {
    console.error('Error loading icons:', err)
  } finally {
    loadingIcons.value = false
  }
}

const loadDefaultWindow = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getDefaultWindow()
    if (response.status === 200) {
      defaultWindow.value = response.data
    } else {
      error.value = response.message || 'Failed to load default window'
    }
  } catch (err) {
    error.value = err.message || 'Error loading default window'
  } finally {
    loading.value = false
  }
}

const startEdit = () => {
  if (defaultWindow.value) {
    editingDefaultWindow.value = { ...defaultWindow.value }
  } else {
    // If no default window exists, start with empty form
    editingDefaultWindow.value = { iconTitle: '' }
  }
}

const handleUpdate = async () => {
  if (!editingDefaultWindow.value || !editingDefaultWindow.value.iconTitle) {
    error.value = 'Icon Title is required'
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const hadExistingData = !!defaultWindow.value
    // Use updateDefaultWindow (no ID needed - it updates the single default window entry)
    const response = await apiService.updateDefaultWindow({ iconTitle: editingDefaultWindow.value.iconTitle })
    if (response.status === 200) {
      await loadDefaultWindow()
      cancelEdit()
      alert(hadExistingData ? 'Default window updated successfully!' : 'Default window created successfully!')
    } else {
      error.value = response.message || 'Failed to update default window'
    }
  } catch (err) {
    error.value = err.message || 'Error updating default window'
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  editingDefaultWindow.value = null
}

const toggleDeactivated = async () => {
  if (!defaultWindow.value) return
  
  const action = defaultWindow.value.deactivated ? 'activate' : 'deactivate'
  if (!confirm(`Are you sure you want to ${action} this default window?`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateDefaultWindow({
      deactivated: !defaultWindow.value.deactivated,
    })
    if (response.status === 200) {
      await loadDefaultWindow()
      alert(`Default window ${action}d successfully!`)
    } else {
      error.value = response.message || `Failed to ${action} default window`
    }
  } catch (err) {
    error.value = err.message || `Error ${action}ing default window`
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  await loadIcons()
  await loadDefaultWindow()
  // If no default window exists, show the form immediately
  if (!defaultWindow.value) {
    editingDefaultWindow.value = { iconTitle: '' }
  }
})
</script>

<style scoped>
.default-window-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-background);
  color: var(--color-text);
  min-height: calc(100vh - 100px);
}

.default-window-view h1 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 2rem;
}

.default-window-display {
  margin-top: 2rem;
}

.display-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.display-header h2 {
  margin: 0;
  color: var(--color-heading);
  font-size: 1.5rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.window-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.window-card p {
  margin: 0.5rem 0;
  color: var(--color-text);
  font-size: 1.1rem;
  line-height: 1.6;
}

.window-card strong {
  color: var(--color-heading);
  font-weight: 600;
}
</style>
