<template>
  <div class="colors-view">
    <h1>Colors Management</h1>
    
    <div class="actions">
      <button @click="loadColors" class="btn btn-primary">Refresh</button>
      <button @click="showCreateForm = true" class="btn btn-success">Create New Color</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="editingColor" class="form-container">
      <h2>Edit Color</h2>
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>Light Color:</label>
          <input v-model="editingColor.lightColor" type="text" />
        </div>
        <div class="form-group">
          <label>Aura Color:</label>
          <input v-model="editingColor.auraColor" type="text" />
        </div>
        <div class="form-group">
          <label>Inner Color:</label>
          <input v-model="editingColor.innerColor" type="text" />
        </div>
        <div class="form-group">
          <label>Text Color:</label>
          <input v-model="editingColor.textColor" type="text" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Update</button>
          <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="showCreateForm" class="form-container">
      <h2>Create New Color</h2>
      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label>Light Color:</label>
          <input v-model="newColor.lightColor" type="text" />
        </div>
        <div class="form-group">
          <label>Aura Color:</label>
          <input v-model="newColor.auraColor" type="text" />
        </div>
        <div class="form-group">
          <label>Inner Color:</label>
          <input v-model="newColor.innerColor" type="text" />
        </div>
        <div class="form-group">
          <label>Text Color:</label>
          <input v-model="newColor.textColor" type="text" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Create</button>
          <button type="button" @click="cancelCreate" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="colors && colors.length > 0" class="colors-list">
      <h2>Existing Colors ({{ colors.length }})</h2>
      <div v-for="color in colors" :key="color._id" class="color-card">
        <div class="color-preview" :style="{ backgroundColor: color.lightColor || '#fff' }"></div>
        <div class="color-details">
          <div class="card-header">
            <h3>Color Scheme</h3>
            <div class="card-actions">
              <button @click="startEdit(color)" class="btn btn-edit">Edit</button>
              <button @click="handleDelete(color)" class="btn btn-delete">Delete</button>
            </div>
          </div>
          <p><strong>Light Color:</strong> {{ color.lightColor }}</p>
          <p><strong>Aura Color:</strong> {{ color.auraColor }}</p>
          <p><strong>Inner Color:</strong> {{ color.innerColor }}</p>
          <p><strong>Text Color:</strong> {{ color.textColor }}</p>
        </div>
      </div>
    </div>
    <div v-else-if="!loading" class="no-data">No colors found</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/services/api'

const colors = ref([])
const loading = ref(false)
const error = ref(null)
const showCreateForm = ref(false)
const editingColor = ref(null)

const newColor = ref({
  lightColor: '',
  auraColor: '',
  innerColor: '',
  textColor: '',
})

const loadColors = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getColors()
    if (response.status === 200) {
      colors.value = Array.isArray(response.data) ? response.data : [response.data]
    } else {
      error.value = response.message || 'Failed to load colors'
    }
  } catch (err) {
    error.value = err.message || 'Error loading colors'
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.createColor(newColor.value)
    if (response.status === 201) {
      await loadColors()
      cancelCreate()
      alert('Color created successfully!')
    } else {
      error.value = response.message || 'Failed to create color'
    }
  } catch (err) {
    error.value = err.message || 'Error creating color'
  } finally {
    loading.value = false
  }
}

const startEdit = (color) => {
  editingColor.value = { ...color }
  showCreateForm.value = false
}

const handleUpdate = async () => {
  if (!editingColor.value._id) return
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateColor(editingColor.value._id, editingColor.value)
    if (response.status === 200) {
      await loadColors()
      cancelEdit()
      alert('Color updated successfully!')
    } else {
      error.value = response.message || 'Failed to update color'
    }
  } catch (err) {
    error.value = err.message || 'Error updating color'
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  editingColor.value = null
}

const handleDelete = async (color) => {
  if (!color._id) return
  
  if (!confirm('Are you sure you want to delete this color scheme? This action cannot be undone.')) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.deleteColor(color._id)
    if (response.status === 200) {
      await loadColors()
      alert('Color deleted successfully!')
    } else {
      error.value = response.message || 'Failed to delete color'
    }
  } catch (err) {
    error.value = err.message || 'Error deleting color'
  } finally {
    loading.value = false
  }
}

const cancelCreate = () => {
  showCreateForm.value = false
  newColor.value = {
    lightColor: '',
    auraColor: '',
    innerColor: '',
    textColor: '',
  }
}

onMounted(() => {
  loadColors()
})
</script>

<style scoped>
.colors-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-background);
  color: var(--color-text);
  min-height: calc(100vh - 100px);
}

.colors-view h1 {
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

.colors-list {
  margin-top: 2rem;
}

.colors-list h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.color-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.color-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.color-preview {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  border: 2px solid var(--color-border);
  flex-shrink: 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-details {
  flex: 1;
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

.color-details p {
  margin: 0.5rem 0;
  color: var(--color-text);
  line-height: 1.6;
}

.color-details strong {
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

