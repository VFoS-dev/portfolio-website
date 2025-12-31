<template>
  <div class="projects-view">
    <h1>Projects Management</h1>
    
    <div class="actions">
      <button @click="loadProjects" class="btn btn-primary">Refresh</button>
      <button @click="showCreateForm = true" class="btn btn-success">Create New Project</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="editingProject" class="form-container">
      <h2>Edit Project</h2>
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>ID:</label>
          <input v-model="editingProject.id" type="text" required />
        </div>
        <div class="form-group">
          <label>Title:</label>
          <input v-model="editingProject.title" type="text" required />
        </div>
        <div class="form-group">
          <label>Image:</label>
          <input v-model="editingProject.img" type="text" />
        </div>
        <div class="form-group">
          <label>Description:</label>
          <textarea v-model="editingProject.description" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>Stack:</label>
          <StackInput
            v-model="editingProject.stack"
            :options="skills"
            placeholder="Type to search skills..."
            @enter="handleStackEnter"
          >
            <template #chip="{ item, label }">
              <span>{{ label }}</span>
            </template>
          </StackInput>
        </div>
        <div class="form-group">
          <label>Key Features (comma-separated):</label>
          <input v-model="editingFeaturesInput" type="text" placeholder="Feature 1, Feature 2" />
        </div>
        <div class="form-group">
          <label>Start Date:</label>
          <input v-model="editingProject.startDate" type="text" />
        </div>
        <div class="form-group">
          <label>End Date:</label>
          <input v-model="editingProject.endDate" type="text" />
        </div>
        <div class="form-group">
          <label>Company:</label>
          <select v-model="editingProject.company" class="form-select">
            <option :value="null">No Company</option>
            <option v-for="company in companies" :key="company._id" :value="company._id">
              {{ company.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Type:</label>
          <input v-model="editingProject.type" type="text" />
        </div>
        <div class="form-group">
          <label>Secondary Type:</label>
          <input v-model="editingProject.secondaryType" type="text" />
        </div>
        <div class="form-group">
          <label>Card Number:</label>
          <input v-model.number="editingProject.cardNumber" type="number" />
        </div>
        <div class="form-group">
          <label>
            <input v-model="editingProject.deprecated" type="checkbox" />
            Deprecated
          </label>
        </div>
        <div class="form-group">
          <label>Rarity:</label>
          <input v-model="editingProject.rarity" type="text" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Update</button>
          <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="showCreateForm" class="form-container">
      <h2>Create New Project</h2>
      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label>ID:</label>
          <input v-model="newProject.id" type="text" required />
        </div>
        <div class="form-group">
          <label>Title:</label>
          <input v-model="newProject.title" type="text" required />
        </div>
        <div class="form-group">
          <label>Image:</label>
          <input v-model="newProject.img" type="text" />
        </div>
        <div class="form-group">
          <label>Description:</label>
          <textarea v-model="newProject.description" rows="3"></textarea>
        </div>
        <div class="form-group">
          <label>Stack:</label>
          <StackInput
            v-model="newProject.stack"
            :options="skills"
            placeholder="Type to search skills..."
            @enter="handleStackEnter"
          >
            <template #chip="{ item, label }">
              <span>{{ label }}</span>
            </template>
          </StackInput>
        </div>
        <div class="form-group">
          <label>Key Features (comma-separated):</label>
          <input v-model="featuresInput" type="text" placeholder="Feature 1, Feature 2" />
        </div>
        <div class="form-group">
          <label>Start Date:</label>
          <input v-model="newProject.startDate" type="text" />
        </div>
        <div class="form-group">
          <label>End Date:</label>
          <input v-model="newProject.endDate" type="text" />
        </div>
        <div class="form-group">
          <label>Company:</label>
          <select v-model="newProject.company" class="form-select">
            <option :value="null">No Company</option>
            <option v-for="company in companies" :key="company._id" :value="company._id">
              {{ company.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label>Type:</label>
          <input v-model="newProject.type" type="text" />
        </div>
        <div class="form-group">
          <label>Secondary Type:</label>
          <input v-model="newProject.secondaryType" type="text" />
        </div>
        <div class="form-group">
          <label>Card Number:</label>
          <input v-model.number="newProject.cardNumber" type="number" />
        </div>
        <div class="form-group">
          <label>
            <input v-model="newProject.deprecated" type="checkbox" />
            Deprecated
          </label>
        </div>
        <div class="form-group">
          <label>Rarity:</label>
          <input v-model="newProject.rarity" type="text" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Create</button>
          <button type="button" @click="cancelCreate" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="projects && projects.length > 0" class="projects-list">
      <h2>Existing Projects ({{ projects.length }})</h2>
      <div v-for="project in projects" :key="project._id || project.id" class="project-card">
        <div class="card-header">
          <h3>{{ project.title }}</h3>
          <div class="card-actions">
            <button @click="startEdit(project)" class="btn btn-edit">Edit</button>
            <button @click="toggleDeactivated(project)" class="btn" :class="project.deactivated ? 'btn-activate' : 'btn-deactivate'">
              {{ project.deactivated ? 'Activate' : 'Deactivate' }}
            </button>
            <button @click="handleDelete(project)" class="btn btn-delete">Delete</button>
          </div>
        </div>
        <p><strong>ID:</strong> {{ project.id }}</p>
        <p v-if="project.deactivated" class="deactivated-badge">⚠️ Deactivated</p>
        <p><strong>Company:</strong> {{ project.company?.name || 'No Company' }}</p>
        <p><strong>Type:</strong> {{ project.type }}</p>
        <p><strong>Card Number:</strong> {{ project.cardNumber }}</p>
        <p v-if="project.description"><strong>Description:</strong> {{ project.description }}</p>
        <p v-if="project.stack && project.stack.length > 0"><strong>Stack:</strong> {{ project.stack.map(s => s.name || s).join(', ') }}</p>
      </div>
    </div>
    <div v-else-if="!loading" class="no-data">No projects found</div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import apiService from '@/services/api'
import StackInput from '@/components/StackInput.vue'

const projects = ref([])
const companies = ref([])
const skills = ref([])
const loading = ref(false)
const error = ref(null)
const showCreateForm = ref(false)
const editingProject = ref(null)
const featuresInput = ref('')
const editingFeaturesInput = ref('')

const newProject = ref({
  id: '',
  title: '',
  img: '',
  description: '',
  stack: [],
  keyFeatures: [],
  startDate: '',
  endDate: '',
  company: null,
  type: '',
  secondaryType: '',
  links: {},
  cardNumber: 0,
  deprecated: false,
  rarity: '',
})

watch(featuresInput, (val) => {
  newProject.value.keyFeatures = val ? val.split(',').map(f => f.trim()).filter(f => f) : []
})

watch(editingFeaturesInput, (val) => {
  if (editingProject.value) {
    editingProject.value.keyFeatures = val ? val.split(',').map(f => f.trim()).filter(f => f) : []
  }
})


const loadProjects = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getProjects()
    if (response.status === 200) {
      projects.value = Array.isArray(response.data) ? response.data : [response.data]
    } else {
      error.value = response.message || 'Failed to load projects'
    }
  } catch (err) {
    error.value = err.message || 'Error loading projects'
  } finally {
    loading.value = false
  }
}

const loadSkills = async () => {
  try {
    const response = await apiService.getSkills()
    if (response.status === 200) {
      skills.value = Array.isArray(response.data) ? response.data : [response.data]
    }
  } catch (err) {
    console.error('Failed to load skills:', err)
  }
}

// Handle enter key on stack input (could be used to create new skills or other actions)
const handleStackEnter = (searchValue) => {
  // You can add custom logic here, like creating a new skill
  console.log('Enter pressed with search value:', searchValue)
}

const handleCreate = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.createProject(newProject.value)
    if (response.status === 201) {
      await loadProjects()
      cancelCreate()
      alert('Project created successfully!')
    } else {
      error.value = response.message || 'Failed to create project'
    }
  } catch (err) {
    error.value = err.message || 'Error creating project'
  } finally {
    loading.value = false
  }
}

const startEdit = (project) => {
  editingProject.value = { 
    ...project,
    company: project.company?._id || project.company || null,
    stack: project.stack ? (Array.isArray(project.stack) ? project.stack.map(s => s._id || s) : []) : []
  }
  editingFeaturesInput.value = project.keyFeatures ? project.keyFeatures.join(', ') : ''
  showCreateForm.value = false
}

const handleUpdate = async () => {
  if (!editingProject.value._id) return
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateProject(editingProject.value._id, editingProject.value)
    if (response.status === 200) {
      await loadProjects()
      cancelEdit()
      alert('Project updated successfully!')
    } else {
      error.value = response.message || 'Failed to update project'
    }
  } catch (err) {
    error.value = err.message || 'Error updating project'
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  editingProject.value = null
  editingFeaturesInput.value = ''
}

const toggleDeactivated = async (project) => {
  if (!project._id) return
  
  const action = project.deactivated ? 'activate' : 'deactivate'
  if (!confirm(`Are you sure you want to ${action} "${project.title}"?`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateProject(project._id, {
      ...project,
      deactivated: !project.deactivated,
    })
    if (response.status === 200) {
      await loadProjects()
      alert(`Project ${action}d successfully!`)
    } else {
      error.value = response.message || `Failed to ${action} project`
    }
  } catch (err) {
    error.value = err.message || `Error ${action}ing project`
  } finally {
    loading.value = false
  }
}

const handleDelete = async (project) => {
  if (!project._id) return
  
  if (!confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.deleteProject(project._id)
    if (response.status === 200) {
      await loadProjects()
      alert('Project deleted successfully!')
    } else {
      error.value = response.message || 'Failed to delete project'
    }
  } catch (err) {
    error.value = err.message || 'Error deleting project'
  } finally {
    loading.value = false
  }
}

const cancelCreate = () => {
  showCreateForm.value = false
  newProject.value = {
    id: '',
    title: '',
    img: '',
    description: '',
    stack: [],
    keyFeatures: [],
    startDate: '',
    endDate: '',
    company: null,
    type: '',
    secondaryType: '',
    links: {},
    cardNumber: 0,
    deprecated: false,
    rarity: '',
  }
  featuresInput.value = ''
}

const loadCompanies = async () => {
  try {
    const response = await apiService.getCompanies()
    if (response.status === 200) {
      companies.value = Array.isArray(response.data) ? response.data : [response.data]
    }
  } catch (err) {
    console.error('Error loading companies:', err)
  }
}

onMounted(() => {
  loadProjects()
  loadCompanies()
  loadSkills()
})
</script>

<style scoped>
.projects-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-background);
  color: var(--color-text);
  min-height: calc(100vh - 100px);
}

.projects-view h1 {
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
.form-group textarea,
.form-group select {
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
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.form-select {
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
}

.projects-list {
  margin-top: 2rem;
}

.projects-list h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.project-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.project-card:hover {
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
  margin-top: 0.5rem;
  display: inline-block;
}

.project-card p {
  margin: 0.5rem 0;
  color: var(--color-text);
  line-height: 1.6;
}

.project-card strong {
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

