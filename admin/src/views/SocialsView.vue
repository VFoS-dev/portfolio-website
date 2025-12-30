<template>
  <div class="socials-view">
    <h1>Socials Management</h1>
    
    <div class="actions">
      <button @click="loadSocials" class="btn btn-primary">Refresh</button>
      <button @click="showCreateForm = true" class="btn btn-success">Create New Social</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="editingSocial" class="form-container">
      <h2>Edit Social</h2>
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>Name:</label>
          <input v-model="editingSocial.name" type="text" required />
        </div>
        <div class="form-group">
          <label>Href:</label>
          <input v-model="editingSocial.href" type="text" />
        </div>
        <div class="form-group">
          <label>GIF:</label>
          <input v-model="editingSocial.gif" type="text" />
        </div>
        <div class="form-group">
          <label>Ring:</label>
          <input v-model="editingSocial.ring" type="text" />
        </div>
        <div class="form-group">
          <label>Shadow:</label>
          <input v-model="editingSocial.shadow" type="text" />
        </div>
        <h3>Upper</h3>
        <div class="form-group">
          <label>Upper Fill:</label>
          <input v-model="editingSocial.upper.fill" type="text" />
        </div>
        <div class="form-group">
          <label>Upper Stroke:</label>
          <input v-model="editingSocial.upper.stroke" type="text" />
        </div>
        <h3>Lower</h3>
        <div class="form-group">
          <label>Lower Fill:</label>
          <input v-model="editingSocial.lower.fill" type="text" />
        </div>
        <div class="form-group">
          <label>Lower Stroke:</label>
          <input v-model="editingSocial.lower.stroke" type="text" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Update</button>
          <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="showCreateForm" class="form-container">
      <h2>Create New Social</h2>
      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label>Name:</label>
          <input v-model="newSocial.name" type="text" required />
        </div>
        <div class="form-group">
          <label>Href:</label>
          <input v-model="newSocial.href" type="text" />
        </div>
        <div class="form-group">
          <label>GIF:</label>
          <input v-model="newSocial.gif" type="text" />
        </div>
        <div class="form-group">
          <label>Ring:</label>
          <input v-model="newSocial.ring" type="text" />
        </div>
        <div class="form-group">
          <label>Shadow:</label>
          <input v-model="newSocial.shadow" type="text" />
        </div>
        <h3>Upper</h3>
        <div class="form-group">
          <label>Upper Fill:</label>
          <input v-model="newSocial.upper.fill" type="text" />
        </div>
        <div class="form-group">
          <label>Upper Stroke:</label>
          <input v-model="newSocial.upper.stroke" type="text" />
        </div>
        <h3>Lower</h3>
        <div class="form-group">
          <label>Lower Fill:</label>
          <input v-model="newSocial.lower.fill" type="text" />
        </div>
        <div class="form-group">
          <label>Lower Stroke:</label>
          <input v-model="newSocial.lower.stroke" type="text" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Create</button>
          <button type="button" @click="cancelCreate" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="socials && socials.length > 0" class="socials-list">
      <h2>Existing Socials ({{ socials.length }})</h2>
      <div v-for="social in socials" :key="social._id" class="social-card">
        <div class="card-header">
          <h3>{{ social.name }}</h3>
          <div class="card-actions">
            <button @click="startEdit(social)" class="btn btn-edit">Edit</button>
            <button @click="toggleDeactivated(social)" class="btn" :class="social.deactivated ? 'btn-activate' : 'btn-deactivate'">
              {{ social.deactivated ? 'Activate' : 'Deactivate' }}
            </button>
            <button @click="handleDelete(social)" class="btn btn-delete">Delete</button>
          </div>
        </div>
        <p v-if="social.deactivated" class="deactivated-badge">⚠️ Deactivated</p>
        <p><strong>Href:</strong> <a :href="social.href" target="_blank">{{ social.href }}</a></p>
        <p v-if="social.gif"><strong>GIF:</strong> {{ social.gif }}</p>
        <p v-if="social.ring"><strong>Ring:</strong> {{ social.ring }}</p>
        <p v-if="social.shadow"><strong>Shadow:</strong> {{ social.shadow }}</p>
        <div v-if="social.upper" class="nested">
          <strong>Upper:</strong>
          <p>Fill: {{ social.upper.fill }}, Stroke: {{ social.upper.stroke }}</p>
        </div>
        <div v-if="social.lower" class="nested">
          <strong>Lower:</strong>
          <p>Fill: {{ social.lower.fill }}, Stroke: {{ social.lower.stroke }}</p>
        </div>
      </div>
    </div>
    <div v-else-if="!loading" class="no-data">No socials found</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/services/api'

const socials = ref([])
const loading = ref(false)
const error = ref(null)
const showCreateForm = ref(false)
const editingSocial = ref(null)

const newSocial = ref({
  name: '',
  href: '',
  gif: '',
  ring: '',
  shadow: '',
  upper: {
    fill: '',
    stroke: '',
  },
  lower: {
    fill: '',
    stroke: '',
  },
})

const loadSocials = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getSocials()
    if (response.status === 200) {
      socials.value = Array.isArray(response.data) ? response.data : [response.data]
    } else {
      error.value = response.message || 'Failed to load socials'
    }
  } catch (err) {
    error.value = err.message || 'Error loading socials'
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.createSocial(newSocial.value)
    if (response.status === 201) {
      await loadSocials()
      cancelCreate()
      alert('Social created successfully!')
    } else {
      error.value = response.message || 'Failed to create social'
    }
  } catch (err) {
    error.value = err.message || 'Error creating social'
  } finally {
    loading.value = false
  }
}

const startEdit = (social) => {
  editingSocial.value = {
    ...social,
    upper: { ...social.upper },
    lower: { ...social.lower },
  }
  showCreateForm.value = false
}

const handleUpdate = async () => {
  if (!editingSocial.value._id) return
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateSocial(editingSocial.value._id, editingSocial.value)
    if (response.status === 200) {
      await loadSocials()
      cancelEdit()
      alert('Social updated successfully!')
    } else {
      error.value = response.message || 'Failed to update social'
    }
  } catch (err) {
    error.value = err.message || 'Error updating social'
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  editingSocial.value = null
}

const toggleDeactivated = async (social) => {
  if (!social._id) return
  
  const action = social.deactivated ? 'activate' : 'deactivate'
  if (!confirm(`Are you sure you want to ${action} "${social.name}"?`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateSocial(social._id, {
      ...social,
      deactivated: !social.deactivated,
    })
    if (response.status === 200) {
      await loadSocials()
      alert(`Social ${action}d successfully!`)
    } else {
      error.value = response.message || `Failed to ${action} social`
    }
  } catch (err) {
    error.value = err.message || `Error ${action}ing social`
  } finally {
    loading.value = false
  }
}

const handleDelete = async (social) => {
  if (!social._id) return
  
  if (!confirm(`Are you sure you want to delete "${social.name}"? This action cannot be undone.`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.deleteSocial(social._id)
    if (response.status === 200) {
      await loadSocials()
      alert('Social deleted successfully!')
    } else {
      error.value = response.message || 'Failed to delete social'
    }
  } catch (err) {
    error.value = err.message || 'Error deleting social'
  } finally {
    loading.value = false
  }
}

const cancelCreate = () => {
  showCreateForm.value = false
  newSocial.value = {
    name: '',
    href: '',
    gif: '',
    ring: '',
    shadow: '',
    upper: {
      fill: '',
      stroke: '',
    },
    lower: {
      fill: '',
      stroke: '',
    },
  }
}

onMounted(() => {
  loadSocials()
})
</script>

<style scoped>
.socials-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-background);
  color: var(--color-text);
  min-height: calc(100vh - 100px);
}

.socials-view h1 {
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

.form-container h3 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-border);
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

.socials-list {
  margin-top: 2rem;
}

.socials-list h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.social-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.social-card:hover {
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

.social-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-heading);
  font-size: 1.25rem;
}

.social-card p {
  margin: 0.5rem 0;
  color: var(--color-text);
  line-height: 1.6;
}

.social-card strong {
  color: var(--color-heading);
  font-weight: 600;
}

.social-card a {
  color: #007bff;
  text-decoration: none;
  word-break: break-all;
}

.social-card a:hover {
  text-decoration: underline;
}

.nested {
  margin-top: 1rem;
  padding-left: 1rem;
  border-left: 3px solid var(--color-border);
}

.nested p {
  margin: 0.25rem 0;
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

