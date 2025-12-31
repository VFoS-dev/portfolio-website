<template>
  <div class="sabers-view">
    <h1>Sabers Management</h1>
    
    <div class="actions">
      <button @click="loadSabers" class="btn btn-primary">Refresh</button>
      <button @click="showCreateForm = true" class="btn btn-success">Create New Saber</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="editingSaber" class="form-container">
      <h2>Edit Saber</h2>
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>Light Color:</label>
          <div class="color-input-group">
            <input v-model="editingSaber.lightColor" type="color" class="color-picker" />
            <input v-model="editingSaber.lightColor" type="text" class="color-text" placeholder="#ffffff" />
          </div>
        </div>
        <div class="form-group">
          <label>Aura Color:</label>
          <div class="color-input-group">
            <input v-model="editingSaber.auraColor" type="color" class="color-picker" />
            <input v-model="editingSaber.auraColor" type="text" class="color-text" placeholder="#0000ff" />
          </div>
        </div>
        <div class="form-group">
          <label>Inner Color:</label>
          <div class="color-input-group">
            <input v-model="editingSaber.innerColor" type="color" class="color-picker" />
            <input v-model="editingSaber.innerColor" type="text" class="color-text" placeholder="#ffffff" />
          </div>
        </div>
        <div class="form-group">
          <label>Text Color:</label>
          <div class="color-input-group">
            <input v-model="editingSaber.textColor" type="color" class="color-picker" />
            <input v-model="editingSaber.textColor" type="text" class="color-text" placeholder="#000000" />
          </div>
        </div>
        <div class="form-group">
          <label>Preview:</label>
          <div class="saber-preview-container">
            <div class="saber-preview-hilt"></div>
            <div class="saber-preview-blade" :style="getPreviewStyles(editingSaber)">
              <div class="saber-preview-light"></div>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Update</button>
          <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="showCreateForm" class="form-container">
      <h2>Create New Saber</h2>
      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label>Light Color:</label>
          <div class="color-input-group">
            <input v-model="newSaber.lightColor" type="color" class="color-picker" />
            <input v-model="newSaber.lightColor" type="text" class="color-text" placeholder="#ffffff" />
          </div>
        </div>
        <div class="form-group">
          <label>Aura Color:</label>
          <div class="color-input-group">
            <input v-model="newSaber.auraColor" type="color" class="color-picker" />
            <input v-model="newSaber.auraColor" type="text" class="color-text" placeholder="#0000ff" />
          </div>
        </div>
        <div class="form-group">
          <label>Inner Color:</label>
          <div class="color-input-group">
            <input v-model="newSaber.innerColor" type="color" class="color-picker" />
            <input v-model="newSaber.innerColor" type="text" class="color-text" placeholder="#ffffff" />
          </div>
        </div>
        <div class="form-group">
          <label>Text Color:</label>
          <div class="color-input-group">
            <input v-model="newSaber.textColor" type="color" class="color-picker" />
            <input v-model="newSaber.textColor" type="text" class="color-text" placeholder="#000000" />
          </div>
        </div>
        <div class="form-group">
          <label>Preview:</label>
          <div class="saber-preview-container">
            <div class="saber-preview-hilt"></div>
            <div class="saber-preview-blade" :style="getPreviewStyles(newSaber)">
              <div class="saber-preview-light"></div>
            </div>
          </div>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Create</button>
          <button type="button" @click="cancelCreate" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="sabers && sabers.length > 0" class="sabers-list">
      <h2>Existing Sabers ({{ sabers.length }})</h2>
      <div v-for="saber in sabers" :key="saber._id" class="saber-card">
        <div class="saber-preview-container">
          <div class="saber-preview-hilt"></div>
          <div class="saber-preview-blade" :style="getPreviewStyles(saber)">
            <div class="saber-preview-light"></div>
          </div>
        </div>
        <div class="saber-details">
          <div class="card-header">
            <h3>Saber Scheme</h3>
            <div class="card-actions">
              <button @click="startEdit(saber)" class="btn btn-edit">Edit</button>
              <button @click="toggleDeactivated(saber)" class="btn" :class="saber.deactivated ? 'btn-activate' : 'btn-deactivate'">
                {{ saber.deactivated ? 'Activate' : 'Deactivate' }}
              </button>
              <button @click="handleDelete(saber)" class="btn btn-delete">Delete</button>
            </div>
          </div>
          <p v-if="saber.deactivated" class="deactivated-badge">⚠️ Deactivated</p>
          <p><strong>Light Color:</strong> {{ saber.lightColor }}</p>
          <p><strong>Aura Color:</strong> {{ saber.auraColor }}</p>
          <p><strong>Inner Color:</strong> {{ saber.innerColor }}</p>
          <p><strong>Text Color:</strong> {{ saber.textColor }}</p>
        </div>
      </div>
    </div>
    <div v-else-if="!loading" class="no-data">No sabers found</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/services/api'

const sabers = ref([])
const loading = ref(false)
const error = ref(null)
const showCreateForm = ref(false)
const editingSaber = ref(null)

const newSaber = ref({
  lightColor: '#ffffff',
  auraColor: '#0000ff',
  innerColor: '#ffffff',
  textColor: '#000000',
})

// Helper to convert color names to hex
const normalizeColor = (color) => {
  if (!color) return '#ffffff'
  // If it's already a hex color, return it
  if (color.startsWith('#')) return color
  // Convert common color names to hex
  const colorMap = {
    'white': '#ffffff',
    'black': '#000000',
    'red': '#ff0000',
    'green': '#00ff00',
    'blue': '#0000ff',
    'yellow': '#ffff00',
    'orange': '#ffa500',
    'magenta': '#ff00ff',
  }
  return colorMap[color.toLowerCase()] || color
}

const loadSabers = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getSabers()
    if (response.status === 200) {
      sabers.value = Array.isArray(response.data) ? response.data : [response.data]
      // Normalize colors to hex format
      sabers.value = sabers.value.map(saber => ({
        ...saber,
        lightColor: normalizeColor(saber.lightColor),
        auraColor: normalizeColor(saber.auraColor),
        innerColor: normalizeColor(saber.innerColor),
        textColor: normalizeColor(saber.textColor),
      }))
    } else {
      error.value = response.message || 'Failed to load sabers'
    }
  } catch (err) {
    error.value = err.message || 'Error loading sabers'
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.createSaber(newSaber.value)
    if (response.status === 201) {
      await loadSabers()
      cancelCreate()
      alert('Saber created successfully!')
    } else {
      error.value = response.message || 'Failed to create saber'
    }
  } catch (err) {
    error.value = err.message || 'Error creating saber'
  } finally {
    loading.value = false
  }
}

const startEdit = (saber) => {
  editingSaber.value = { 
    ...saber,
    lightColor: normalizeColor(saber.lightColor),
    auraColor: normalizeColor(saber.auraColor),
    innerColor: normalizeColor(saber.innerColor),
    textColor: normalizeColor(saber.textColor),
  }
  showCreateForm.value = false
}

const handleUpdate = async () => {
  if (!editingSaber.value._id) return
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateSaber(editingSaber.value._id, editingSaber.value)
    if (response.status === 200) {
      await loadSabers()
      cancelEdit()
      alert('Saber updated successfully!')
    } else {
      error.value = response.message || 'Failed to update saber'
    }
  } catch (err) {
    error.value = err.message || 'Error updating saber'
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  editingSaber.value = null
}

const toggleDeactivated = async (saber) => {
  if (!saber._id) return
  
  const action = saber.deactivated ? 'activate' : 'deactivate'
  if (!confirm(`Are you sure you want to ${action} this saber scheme?`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateSaber(saber._id, {
      ...saber,
      deactivated: !saber.deactivated,
    })
    if (response.status === 200) {
      await loadSabers()
      alert(`Saber ${action}d successfully!`)
    } else {
      error.value = response.message || `Failed to ${action} saber`
    }
  } catch (err) {
    error.value = err.message || `Error ${action}ing saber`
  } finally {
    loading.value = false
  }
}

const handleDelete = async (saber) => {
  if (!saber._id) return
  
  if (!confirm('Are you sure you want to delete this saber scheme? This action cannot be undone.')) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.deleteSaber(saber._id)
    if (response.status === 200) {
      await loadSabers()
      alert('Saber deleted successfully!')
    } else {
      error.value = response.message || 'Failed to delete saber'
    }
  } catch (err) {
    error.value = err.message || 'Error deleting saber'
  } finally {
    loading.value = false
  }
}

const cancelCreate = () => {
  showCreateForm.value = false
  newSaber.value = {
    lightColor: '#ffffff',
    auraColor: '#0000ff',
    innerColor: '#ffffff',
    textColor: '#000000',
  }
}

const getPreviewStyles = (saber) => {
  if (!saber) return {}
  const lightColor = normalizeColor(saber.lightColor || '#ffffff')
  const innerColor = normalizeColor(saber.innerColor || '#ffffff')
  const auraColor = normalizeColor(saber.auraColor || '#0000ff')
  
  return {
    '--light-color': lightColor,
    '--inner-color': innerColor,
    '--aura-color': auraColor,
  }
}

onMounted(() => {
  loadSabers()
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

.color-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-picker {
  width: 60px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  background: none;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.color-text {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: monospace;
}

.color-text:focus {
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

.sabers-list {
  margin-top: 2rem;
}

.sabers-list h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.saber-card {
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

.saber-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.saber-preview-container {
  width: 250px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  flex-shrink: 0;
  margin-left: 92px;
}

.saber-preview-hilt {
  content: '';
  background-image: url(/images/skills/hilt.png);
  background-repeat: no-repeat;
  background-size: contain;
  width: 92px;
  height: 16px;
  position: absolute;
  left: -92px;
  z-index: 1;
}

.saber-preview-blade {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.saber-preview-light {
  position: absolute;
  height: 40%;
  width: 100%;
  border-radius: 2px 7px 7px 2px;
  background-color: var(--light-color, #ffffff);
  box-shadow:
    0 0 5px var(--inner-color, #ffffff),
    0 0 12px var(--inner-color, #ffffff),
    0 0 15px var(--aura-color, #0000ff),
    0 0 35px var(--aura-color, #0000ff);
}

.saber-details {
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

