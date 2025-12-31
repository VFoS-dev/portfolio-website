<template>
  <div class="about-view">
    <h1>About Management</h1>
    
    <div class="actions">
      <button @click="loadAbout" class="btn btn-primary">Refresh</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="editingAbout || !aboutData" class="form-container">
      <h2>{{ aboutData ? 'Edit About' : 'Create About' }}</h2>
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>Text:</label>
          <textarea v-model="editingTextInput" rows="15" placeholder="Enter text. Use tabs or two spaces at the start of lines for indentation. Use #id at the end of lines for IDs (e.g., 'Section:#section')"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">{{ aboutData ? 'Update' : 'Create' }}</button>
          <button v-if="aboutData" type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="aboutData" class="about-display">
      <div class="display-header">
        <h2>Current About</h2>
        <div class="card-actions">
          <button @click="startEdit" class="btn btn-edit">Edit</button>
          <button @click="toggleDeactivated" class="btn" :class="aboutData.deactivated ? 'btn-activate' : 'btn-deactivate'">
            {{ aboutData.deactivated ? 'Activate' : 'Deactivate' }}
          </button>
        </div>
      </div>
      <div v-if="aboutData.deactivated" class="deactivated-badge">⚠️ Deactivated</div>
      <div class="text-display">
        <pre class="text-content">{{ aboutData.text }}</pre>
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
const editingAbout = ref(null)
const editingTextInput = ref('')

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


const startEdit = () => {
  if (aboutData.value) {
    editingAbout.value = { ...aboutData.value }
    // Convert two-space indentation back to tabs for easier editing
    editingTextInput.value = aboutData.value.text ? aboutData.value.text.replace(/^  /gm, '\t') : ''
  } else {
    // If no about data exists, start with empty form
    editingAbout.value = { text: '' }
    editingTextInput.value = ''
  }
}

const handleUpdate = async () => {
  loading.value = true
  error.value = null
  try {
    // Convert tabs to "new line space space" format for storage
    let textString = editingTextInput.value || ''
    // Replace tabs at start of lines with "new line space space"
    textString = textString.replace(/^\t/gm, '  ')
    // Also handle tabs that might be in the middle (convert all tabs to two spaces)
    textString = textString.replace(/\t/g, '  ')
    
    // Use updateAbout (no ID needed - it updates the single about entry)
    const hadExistingData = !!aboutData.value
    const response = await apiService.updateAbout({ text: textString })
    if (response.status === 200) {
      await loadAbout()
      cancelEdit()
      alert(hadExistingData ? 'About updated successfully!' : 'About created successfully!')
    } else {
      error.value = response.message || 'Failed to update about'
    }
  } catch (err) {
    error.value = err.message || 'Error updating about'
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  editingAbout.value = null
  editingTextInput.value = ''
}

const toggleDeactivated = async () => {
  if (!aboutData.value) return
  
  const action = aboutData.value.deactivated ? 'activate' : 'deactivate'
  if (!confirm(`Are you sure you want to ${action} this about page?`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateAbout({
      deactivated: !aboutData.value.deactivated,
    })
    if (response.status === 200) {
      await loadAbout()
      alert(`About page ${action}d successfully!`)
    } else {
      error.value = response.message || `Failed to ${action} about page`
    }
  } catch (err) {
    error.value = err.message || `Error ${action}ing about page`
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAbout().then(() => {
    // If no about data exists, show the form immediately
    if (!aboutData.value) {
      startEdit()
    }
  })
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

.text-display {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.text-content {
  color: var(--color-text);
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: inherit;
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
