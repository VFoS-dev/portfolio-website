<template>
  <div class="default-window-view">
    <h1>Default Window Management</h1>
    
    <div class="actions">
      <button @click="loadDefaultWindow" class="btn btn-primary">Refresh</button>
      <button @click="showCreateForm = true" class="btn btn-success">Create New Default Window</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="editingDefaultWindow" class="form-container">
      <h2>Edit Default Window</h2>
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>Icon Title (required):</label>
          <input v-model="editingDefaultWindow.iconTitle" type="text" required />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Update</button>
          <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="showCreateForm" class="form-container">
      <h2>Create New Default Window</h2>
      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label>Icon Title (required):</label>
          <input v-model="newDefaultWindow.iconTitle" type="text" required />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Create</button>
          <button type="button" @click="cancelCreate" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="defaultWindow" class="default-window-display">
      <div class="display-header">
        <h2>Current Default Window</h2>
        <div class="card-actions">
          <button @click="startEdit" class="btn btn-edit">Edit</button>
          <button @click="toggleDeactivated" class="btn" :class="defaultWindow.deactivated ? 'btn-activate' : 'btn-deactivate'">
            {{ defaultWindow.deactivated ? 'Activate' : 'Deactivate' }}
          </button>
          <button @click="handleDelete" class="btn btn-delete">Delete</button>
        </div>
      </div>
      <div v-if="defaultWindow.deactivated" class="deactivated-badge">⚠️ Deactivated</div>
      <div class="window-card">
        <p><strong>Icon Title:</strong> {{ defaultWindow.iconTitle }}</p>
      </div>
    </div>
    <div v-else-if="!loading" class="no-data">No default window found</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/services/api'

const defaultWindow = ref(null)
const loading = ref(false)
const error = ref(null)
const showCreateForm = ref(false)
const editingDefaultWindow = ref(null)

const newDefaultWindow = ref({
  iconTitle: '',
})

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

const handleCreate = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.createDefaultWindow(newDefaultWindow.value)
    if (response.status === 201) {
      await loadDefaultWindow()
      cancelCreate()
      alert('Default window created successfully!')
    } else {
      error.value = response.message || 'Failed to create default window'
    }
  } catch (err) {
    error.value = err.message || 'Error creating default window'
  } finally {
    loading.value = false
  }
}

const startEdit = () => {
  if (!defaultWindow.value) return
  editingDefaultWindow.value = { ...defaultWindow.value }
  showCreateForm.value = false
}

const handleUpdate = async () => {
  if (!editingDefaultWindow.value._id) return
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateDefaultWindow(editingDefaultWindow.value._id, editingDefaultWindow.value)
    if (response.status === 200) {
      await loadDefaultWindow()
      cancelEdit()
      alert('Default window updated successfully!')
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
  if (!defaultWindow.value || !defaultWindow.value._id) return
  
  const action = defaultWindow.value.deactivated ? 'activate' : 'deactivate'
  if (!confirm(`Are you sure you want to ${action} this default window?`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateDefaultWindow(defaultWindow.value._id, {
      ...defaultWindow.value,
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

const handleDelete = async () => {
  if (!defaultWindow.value || !defaultWindow.value._id) return
  
  if (!confirm('Are you sure you want to delete this default window? This action cannot be undone.')) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.deleteDefaultWindow(defaultWindow.value._id)
    if (response.status === 200) {
      defaultWindow.value = null
      alert('Default window deleted successfully!')
    } else {
      error.value = response.message || 'Failed to delete default window'
    }
  } catch (err) {
    error.value = err.message || 'Error deleting default window'
  } finally {
    loading.value = false
  }
}

const cancelCreate = () => {
  showCreateForm.value = false
  newDefaultWindow.value = {
    iconTitle: '',
  }
}

onMounted(() => {
  loadDefaultWindow()
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

.actions {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
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

.form-container {
  background: var(--color-background-soft);
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-container h2 {
  color: var(--color-heading);
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
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
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
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

.btn-edit {
  background-color: #ffc107;
  color: #000;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-edit:hover {
  background-color: #e0a800;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-delete:hover {
  background-color: #c82333;
}

.btn-deactivate {
  background-color: #ffc107;
  color: #000;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-deactivate:hover {
  background-color: #e0a800;
}

.btn-activate {
  background-color: #28a745;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-activate:hover {
  background-color: #218838;
}

.deactivated-badge {
  color: #856404;
  background-color: #fff3cd;
  padding: 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  margin-bottom: 1rem;
  display: inline-block;
}

.default-window-display h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.5rem;
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

.no-data {
  text-align: center;
  padding: 3rem;
  color: var(--color-text);
  font-size: 1.1rem;
  background: var(--color-background-soft);
  border-radius: 8px;
  border: 1px dashed var(--color-border);
}
</style>

