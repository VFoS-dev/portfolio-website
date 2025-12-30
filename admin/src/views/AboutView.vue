<template>
  <div class="about-view">
    <h1>About Data Management</h1>
    
    <div class="actions">
      <button @click="loadAbout" class="btn btn-primary">Refresh</button>
      <button @click="showCreateForm = true" class="btn btn-success">Create New About Data</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="editingAbout" class="form-container">
      <h2>Edit About Data</h2>
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>Text (one per line):</label>
          <textarea v-model="editingTextInput" rows="10" placeholder="Enter text, one item per line"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Update</button>
          <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="showCreateForm" class="form-container">
      <h2>Create New About Data</h2>
      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label>Text (one per line):</label>
          <textarea v-model="textInput" rows="10" placeholder="Enter text, one item per line"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Create</button>
          <button type="button" @click="cancelCreate" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="aboutData" class="about-display">
      <div class="display-header">
        <h2>Current About Data</h2>
        <div class="card-actions">
          <button @click="startEdit" class="btn btn-edit">Edit</button>
          <button @click="toggleDeactivated" class="btn" :class="aboutData.deactivated ? 'btn-activate' : 'btn-deactivate'">
            {{ aboutData.deactivated ? 'Activate' : 'Deactivate' }}
          </button>
          <button @click="handleDelete" class="btn btn-delete">Delete</button>
        </div>
      </div>
      <div v-if="aboutData.deactivated" class="deactivated-badge">⚠️ Deactivated</div>
      <div class="text-list">
        <div v-for="(text, index) in aboutData.text" :key="index" class="text-item">
          {{ text }}
        </div>
      </div>
    </div>
    <div v-else-if="!loading" class="no-data">No about data found</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import apiService from '@/services/api'

const aboutData = ref(null)
const loading = ref(false)
const error = ref(null)
const showCreateForm = ref(false)
const editingAbout = ref(null)
const textInput = ref('')
const editingTextInput = ref('')

const newAbout = ref({
  text: [],
})

watch(textInput, (val) => {
  newAbout.value.text = val ? val.split('\n').map(t => t.trim()).filter(t => t) : []
})

const loadAbout = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getAbout()
    if (response.status === 200) {
      aboutData.value = response.data
    } else {
      error.value = response.message || 'Failed to load about data'
    }
  } catch (err) {
    error.value = err.message || 'Error loading about data'
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.createAbout(newAbout.value)
    if (response.status === 201) {
      await loadAbout()
      cancelCreate()
      alert('About data created successfully!')
    } else {
      error.value = response.message || 'Failed to create about data'
    }
  } catch (err) {
    error.value = err.message || 'Error creating about data'
  } finally {
    loading.value = false
  }
}

const startEdit = () => {
  if (!aboutData.value) return
  editingAbout.value = { ...aboutData.value }
  editingTextInput.value = aboutData.value.text ? aboutData.value.text.join('\n') : ''
  showCreateForm.value = false
}

const handleUpdate = async () => {
  if (!editingAbout.value._id) return
  
  loading.value = true
  error.value = null
  try {
    const textArray = editingTextInput.value ? editingTextInput.value.split('\n').map(t => t.trim()).filter(t => t) : []
    const response = await apiService.updateAbout(editingAbout.value._id, { text: textArray })
    if (response.status === 200) {
      await loadAbout()
      cancelEdit()
      alert('About data updated successfully!')
    } else {
      error.value = response.message || 'Failed to update about data'
    }
  } catch (err) {
    error.value = err.message || 'Error updating about data'
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  editingAbout.value = null
  editingTextInput.value = ''
}

const toggleDeactivated = async () => {
  if (!aboutData.value || !aboutData.value._id) return
  
  const action = aboutData.value.deactivated ? 'activate' : 'deactivate'
  if (!confirm(`Are you sure you want to ${action} this about data?`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateAbout(aboutData.value._id, {
      ...aboutData.value,
      deactivated: !aboutData.value.deactivated,
    })
    if (response.status === 200) {
      await loadAbout()
      alert(`About data ${action}d successfully!`)
    } else {
      error.value = response.message || `Failed to ${action} about data`
    }
  } catch (err) {
    error.value = err.message || `Error ${action}ing about data`
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!aboutData.value || !aboutData.value._id) return
  
  if (!confirm('Are you sure you want to delete this about data? This action cannot be undone.')) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.deleteAbout(aboutData.value._id)
    if (response.status === 200) {
      aboutData.value = null
      alert('About data deleted successfully!')
    } else {
      error.value = response.message || 'Failed to delete about data'
    }
  } catch (err) {
    error.value = err.message || 'Error deleting about data'
  } finally {
    loading.value = false
  }
}

const cancelCreate = () => {
  showCreateForm.value = false
  newAbout.value = { text: [] }
  textInput.value = ''
}

onMounted(() => {
  loadAbout()
})
</script>

<style scoped>
.about-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-background);
  color: var(--color-text);
  min-height: calc(100vh - 100px);
}

.about-view h1 {
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

.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: inherit;
  resize: vertical;
}

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

.about-display {
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

.about-display h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.text-list {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.text-item {
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--color-border);
  color: var(--color-text);
  line-height: 1.6;
}

.text-item:last-child {
  border-bottom: none;
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
