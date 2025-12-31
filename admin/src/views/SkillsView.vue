<template>
  <div class="skills-view">
    <h1>Skills Management</h1>
    
    <div class="actions">
      <button @click="loadSkills" class="btn btn-primary">Refresh</button>
      <button @click="showCreateForm = true" class="btn btn-success">Create New Skill</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="editingSkill" class="form-container">
      <h2>Edit Skill</h2>
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>Group:</label>
          <input v-model="editingSkill.group" type="text" required />
        </div>
        <div class="form-group">
          <label>Name:</label>
          <input v-model="editingSkill.name" type="text" required />
        </div>
        <div class="form-group">
          <label>Percent:</label>
          <input v-model.number="editingSkill.percent" type="number" min="0" max="100" required />
        </div>
        <div class="form-group">
          <label>Icon:</label>
          <input v-model="editingSkill.icon" type="text" placeholder="Icon path or class name" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Update</button>
          <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="showCreateForm" class="form-container">
      <h2>Create New Skill</h2>
      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label>Group:</label>
          <input v-model="newSkill.group" type="text" required />
        </div>
        <div class="form-group">
          <label>Name:</label>
          <input v-model="newSkill.name" type="text" required />
        </div>
        <div class="form-group">
          <label>Percent:</label>
          <input v-model.number="newSkill.percent" type="number" min="0" max="100" required />
        </div>
        <div class="form-group">
          <label>Icon:</label>
          <input v-model="newSkill.icon" type="text" placeholder="Icon path or class name" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Create</button>
          <button type="button" @click="cancelCreate" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="skills && skills.length > 0" class="skills-list">
      <h2>Existing Skills ({{ skills.length }})</h2>
      <div class="skills-grid">
        <div v-for="skill in skills" :key="skill._id" class="skill-card">
          <div class="card-header">
            <h3>{{ skill.name }}</h3>
            <div class="card-actions">
              <button @click="startEdit(skill)" class="btn btn-edit">Edit</button>
              <button @click="toggleDeactivated(skill)" class="btn" :class="skill.deactivated ? 'btn-activate' : 'btn-deactivate'">
                {{ skill.deactivated ? 'Activate' : 'Deactivate' }}
              </button>
              <button @click="handleDelete(skill)" class="btn btn-delete">Delete</button>
            </div>
          </div>
          <p v-if="skill.deactivated" class="deactivated-badge">⚠️ Deactivated</p>
          <p><strong>Group:</strong> {{ skill.group }}</p>
          <p><strong>Percent:</strong> {{ skill.percent }}%</p>
          <p v-if="skill.icon"><strong>Icon:</strong> {{ skill.icon }}</p>
        </div>
      </div>
    </div>
    <div v-else-if="!loading" class="no-data">No skills found</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/services/api'

const skills = ref([])
const loading = ref(false)
const error = ref(null)
const showCreateForm = ref(false)
const editingSkill = ref(null)

const newSkill = ref({
  group: '',
  name: '',
  percent: 0,
  icon: '',
})

const loadSkills = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getSkills()
    if (response.status === 200) {
      skills.value = Array.isArray(response.data) ? response.data : [response.data]
    } else {
      error.value = response.message || 'Failed to load skills'
    }
  } catch (err) {
    error.value = err.message || 'Error loading skills'
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.createSkill(newSkill.value)
    if (response.status === 201) {
      await loadSkills()
      cancelCreate()
      alert('Skill created successfully!')
    } else {
      error.value = response.message || 'Failed to create skill'
    }
  } catch (err) {
    error.value = err.message || 'Error creating skill'
  } finally {
    loading.value = false
  }
}

const startEdit = (skill) => {
  editingSkill.value = { ...skill }
  showCreateForm.value = false
}

const handleUpdate = async () => {
  if (!editingSkill.value._id) return
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateSkill(editingSkill.value._id, editingSkill.value)
    if (response.status === 200) {
      await loadSkills()
      cancelEdit()
      alert('Skill updated successfully!')
    } else {
      error.value = response.message || 'Failed to update skill'
    }
  } catch (err) {
    error.value = err.message || 'Error updating skill'
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  editingSkill.value = null
}

const toggleDeactivated = async (skill) => {
  if (!skill._id) return
  
  const action = skill.deactivated ? 'activate' : 'deactivate'
  if (!confirm(`Are you sure you want to ${action} "${skill.name}"?`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateSkill(skill._id, {
      ...skill,
      deactivated: !skill.deactivated,
    })
    if (response.status === 200) {
      await loadSkills()
      alert(`Skill ${action}d successfully!`)
    } else {
      error.value = response.message || `Failed to ${action} skill`
    }
  } catch (err) {
    error.value = err.message || `Error ${action}ing skill`
  } finally {
    loading.value = false
  }
}

const handleDelete = async (skill) => {
  if (!skill._id) return
  
  if (!confirm(`Are you sure you want to delete "${skill.name}"? This action cannot be undone.`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.deleteSkill(skill._id)
    if (response.status === 200) {
      await loadSkills()
      alert('Skill deleted successfully!')
    } else {
      error.value = response.message || 'Failed to delete skill'
    }
  } catch (err) {
    error.value = err.message || 'Error deleting skill'
  } finally {
    loading.value = false
  }
}

const cancelCreate = () => {
  showCreateForm.value = false
  newSkill.value = {
    group: '',
    name: '',
    percent: 0,
    icon: '',
  }
}

onMounted(() => {
  loadSkills()
})
</script>

<style scoped>
.skills-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-background);
  color: var(--color-text);
  min-height: calc(100vh - 100px);
}

.skills-view h1 {
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

.skills-list {
  margin-top: 2rem;
}

.skills-list h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.skill-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.skill-card:hover {
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

.skill-card h3 {
  margin-top: 0;
  margin-bottom: 1rem;
  color: var(--color-heading);
  font-size: 1.25rem;
}

.skill-card p {
  margin: 0.5rem 0;
  color: var(--color-text);
  line-height: 1.6;
}

.skill-card strong {
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

