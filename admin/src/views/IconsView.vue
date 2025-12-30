<template>
  <div class="icons-view">
    <h1>Icons Management</h1>
    
    <div class="actions">
      <button @click="loadIcons" class="btn btn-primary">Refresh</button>
      <button @click="showCreateForm = true" class="btn btn-success">Create New Icon</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="editingIcon" class="form-container">
      <h2>Edit Icon</h2>
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>Title:</label>
          <input v-model="editingIcon.title" type="text" required />
        </div>
        <div class="form-group">
          <label>Desktop Icon:</label>
          <input v-model="editingIcon['desktop-icon']" type="text" />
        </div>
        <div class="form-group">
          <label>Icon:</label>
          <input v-model="editingIcon.icon" type="text" />
        </div>
        <div class="form-group">
          <label>App:</label>
          <input v-model="editingIcon.app" type="text" />
        </div>
        <div class="form-group">
          <label>X:</label>
          <input v-model="editingIcon.x" type="text" />
        </div>
        <div class="form-group">
          <label>Y:</label>
          <input v-model="editingIcon.y" type="text" />
        </div>
        <div class="form-group">
          <label>Width:</label>
          <input v-model="editingIcon.width" type="text" />
        </div>
        <div class="form-group">
          <label>Height:</label>
          <input v-model="editingIcon.height" type="text" />
        </div>
        <div class="form-group">
          <label>
            <input v-model="editingIcon.isTrash" type="checkbox" />
            Is Trash
          </label>
        </div>
        <div class="form-group">
          <label>App Props (JSON):</label>
          <textarea v-model="editingAppPropsInput" rows="4" placeholder='{"key": "value"}'></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Update</button>
          <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="showCreateForm" class="form-container">
      <h2>Create New Icon</h2>
      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label>Title:</label>
          <input v-model="newIcon.title" type="text" required />
        </div>
        <div class="form-group">
          <label>Desktop Icon:</label>
          <input v-model="newIcon['desktop-icon']" type="text" />
        </div>
        <div class="form-group">
          <label>Icon:</label>
          <input v-model="newIcon.icon" type="text" />
        </div>
        <div class="form-group">
          <label>App:</label>
          <input v-model="newIcon.app" type="text" />
        </div>
        <div class="form-group">
          <label>X:</label>
          <input v-model="newIcon.x" type="text" />
        </div>
        <div class="form-group">
          <label>Y:</label>
          <input v-model="newIcon.y" type="text" />
        </div>
        <div class="form-group">
          <label>Width:</label>
          <input v-model="newIcon.width" type="text" />
        </div>
        <div class="form-group">
          <label>Height:</label>
          <input v-model="newIcon.height" type="text" />
        </div>
        <div class="form-group">
          <label>
            <input v-model="newIcon.isTrash" type="checkbox" />
            Is Trash
          </label>
        </div>
        <div class="form-group">
          <label>App Props (JSON):</label>
          <textarea v-model="appPropsInput" rows="4" placeholder='{"key": "value"}'></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Create</button>
          <button type="button" @click="cancelCreate" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="icons && icons.length > 0" class="icons-list">
      <h2>Existing Icons ({{ icons.length }})</h2>
      <div v-for="icon in icons" :key="icon._id" class="icon-card">
        <div class="card-header">
          <h3>{{ icon.title }}</h3>
          <div class="card-actions">
            <button @click="startEdit(icon)" class="btn btn-edit">Edit</button>
            <button @click="toggleDeactivated(icon)" class="btn" :class="icon.deactivated ? 'btn-activate' : 'btn-deactivate'">
              {{ icon.deactivated ? 'Activate' : 'Deactivate' }}
            </button>
            <button @click="handleDelete(icon)" class="btn btn-delete">Delete</button>
          </div>
        </div>
        <p v-if="icon.deactivated" class="deactivated-badge">⚠️ Deactivated</p>
        <p><strong>App:</strong> {{ icon.app }}</p>
        <p><strong>Position:</strong> ({{ icon.x }}, {{ icon.y }})</p>
        <p><strong>Size:</strong> {{ icon.width }} x {{ icon.height }}</p>
        <p><strong>Is Trash:</strong> {{ icon.isTrash ? 'Yes' : 'No' }}</p>
      </div>
    </div>
    <div v-else-if="!loading" class="no-data">No icons found</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import apiService from '@/services/api'

const icons = ref([])
const loading = ref(false)
const error = ref(null)
const showCreateForm = ref(false)
const editingIcon = ref(null)
const appPropsInput = ref('{}')
const editingAppPropsInput = ref('{}')

const newIcon = ref({
  title: '',
  'desktop-icon': '',
  icon: '',
  app: '',
  x: '',
  y: '',
  width: '',
  height: '',
  isTrash: false,
  appProps: {},
})

watch(appPropsInput, (val) => {
  try {
    newIcon.value.appProps = val ? JSON.parse(val) : {}
  } catch (e) {
    // Invalid JSON, keep previous value
  }
})

watch(editingAppPropsInput, (val) => {
  if (editingIcon.value) {
    try {
      editingIcon.value.appProps = val ? JSON.parse(val) : {}
    } catch (e) {
      // Invalid JSON, keep previous value
    }
  }
})

const loadIcons = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getIcons()
    if (response.status === 200) {
      icons.value = Array.isArray(response.data) ? response.data : [response.data]
    } else {
      error.value = response.message || 'Failed to load icons'
    }
  } catch (err) {
    error.value = err.message || 'Error loading icons'
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.createIcon(newIcon.value)
    if (response.status === 201) {
      await loadIcons()
      cancelCreate()
      alert('Icon created successfully!')
    } else {
      error.value = response.message || 'Failed to create icon'
    }
  } catch (err) {
    error.value = err.message || 'Error creating icon'
  } finally {
    loading.value = false
  }
}

const startEdit = (icon) => {
  editingIcon.value = { ...icon }
  editingAppPropsInput.value = JSON.stringify(icon.appProps || {}, null, 2)
  showCreateForm.value = false
}

const handleUpdate = async () => {
  if (!editingIcon.value._id) return
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateIcon(editingIcon.value._id, editingIcon.value)
    if (response.status === 200) {
      await loadIcons()
      cancelEdit()
      alert('Icon updated successfully!')
    } else {
      error.value = response.message || 'Failed to update icon'
    }
  } catch (err) {
    error.value = err.message || 'Error updating icon'
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  editingIcon.value = null
  editingAppPropsInput.value = '{}'
}

const toggleDeactivated = async (icon) => {
  if (!icon._id) return
  
  const action = icon.deactivated ? 'activate' : 'deactivate'
  if (!confirm(`Are you sure you want to ${action} "${icon.title}"?`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateIcon(icon._id, {
      ...icon,
      deactivated: !icon.deactivated,
    })
    if (response.status === 200) {
      await loadIcons()
      alert(`Icon ${action}d successfully!`)
    } else {
      error.value = response.message || `Failed to ${action} icon`
    }
  } catch (err) {
    error.value = err.message || `Error ${action}ing icon`
  } finally {
    loading.value = false
  }
}

const handleDelete = async (icon) => {
  if (!icon._id) return
  
  if (!confirm(`Are you sure you want to delete "${icon.title}"? This action cannot be undone.`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.deleteIcon(icon._id)
    if (response.status === 200) {
      await loadIcons()
      alert('Icon deleted successfully!')
    } else {
      error.value = response.message || 'Failed to delete icon'
    }
  } catch (err) {
    error.value = err.message || 'Error deleting icon'
  } finally {
    loading.value = false
  }
}

const cancelCreate = () => {
  showCreateForm.value = false
  newIcon.value = {
    title: '',
    'desktop-icon': '',
    icon: '',
    app: '',
    x: '',
    y: '',
    width: '',
    height: '',
    isTrash: false,
    appProps: {},
  }
  appPropsInput.value = '{}'
}

onMounted(() => {
  loadIcons()
})
</script>

<style scoped>
.icons-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-background);
  color: var(--color-text);
  min-height: calc(100vh - 100px);
}

.icons-view h1 {
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

.form-group input[type="checkbox"] {
  width: auto;
  margin-right: 0.5rem;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s, box-shadow 0.2s;
}

.form-group input:focus,
.form-group textarea:focus {
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

.icons-list {
  margin-top: 2rem;
}

.icons-list h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.icon-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.icon-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h3 {
  margin: 0;
  color: var(--color-heading);
  font-size: 1.25rem;
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
  margin-bottom: 0.5rem;
  display: inline-block;
}

.icon-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-heading);
  font-size: 1.25rem;
}

.icon-card p {
  margin: 0.5rem 0;
  color: var(--color-text);
  line-height: 1.6;
}

.icon-card strong {
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

