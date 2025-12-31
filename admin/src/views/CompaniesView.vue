<template>
  <div class="companies-view">
    <h1>Companies Management</h1>
    
    <div class="actions">
      <button @click="loadCompanies" class="btn btn-primary">Refresh</button>
      <button @click="showCreateForm = true" class="btn btn-success">Create New Company</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="editingCompany" class="form-container">
      <h2>Edit Company</h2>
      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label>Name:</label>
          <input v-model="editingCompany.name" type="text" required />
        </div>
        <div class="form-group">
          <label>Logo:</label>
          <input v-model="editingCompany.logo" type="text" />
        </div>
        <div class="form-group">
          <label>Start Date:</label>
          <input v-model="editingCompany.startDate" type="text" />
        </div>
        <div class="form-group">
          <label>End Date:</label>
          <input v-model="editingCompany.endDate" type="text" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Update</button>
          <button type="button" @click="cancelEdit" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="showCreateForm" class="form-container">
      <h2>Create New Company</h2>
      <form @submit.prevent="handleCreate">
        <div class="form-group">
          <label>Name:</label>
          <input v-model="newCompany.name" type="text" required />
        </div>
        <div class="form-group">
          <label>Logo:</label>
          <input v-model="newCompany.logo" type="text" />
        </div>
        <div class="form-group">
          <label>Start Date:</label>
          <input v-model="newCompany.startDate" type="text" />
        </div>
        <div class="form-group">
          <label>End Date:</label>
          <input v-model="newCompany.endDate" type="text" />
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary">Create</button>
          <button type="button" @click="cancelCreate" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

    <div v-if="companies && companies.length > 0" class="companies-list">
      <h2>Existing Companies ({{ companies.length }})</h2>
      <div class="companies-grid">
        <div v-for="company in companies" :key="company._id" class="company-card">
          <div class="card-header">
            <h3>{{ company.name }}</h3>
            <div class="card-actions">
              <button @click="startEdit(company)" class="btn btn-edit">Edit</button>
              <button @click="toggleDeactivated(company)" class="btn" :class="company.deactivated ? 'btn-activate' : 'btn-deactivate'">
                {{ company.deactivated ? 'Activate' : 'Deactivate' }}
              </button>
              <button 
                @click="handleDelete(company)" 
                class="btn btn-delete"
                :disabled="company.usageCount > 0"
                :title="company.usageCount > 0 ? 'Cannot delete: company is in use' : 'Delete company'"
              >
                Delete
              </button>
            </div>
          </div>
          <p v-if="company.deactivated" class="deactivated-badge">⚠️ Deactivated</p>
          <p><strong>Usage Count:</strong> {{ company.usageCount || 0 }} project(s)</p>
          <p v-if="company.usageCount > 0" class="usage-warning">⚠️ This company is in use and cannot be deleted</p>
          <p v-if="company.logo"><strong>Logo:</strong> {{ company.logo }}</p>
          <p v-if="company.startDate"><strong>Start Date:</strong> {{ company.startDate }}</p>
          <p v-if="company.endDate"><strong>End Date:</strong> {{ company.endDate }}</p>
        </div>
      </div>
    </div>
    <div v-else-if="!loading" class="no-data">No companies found</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/services/api'

const companies = ref([])
const loading = ref(false)
const error = ref(null)
const showCreateForm = ref(false)
const editingCompany = ref(null)

const newCompany = ref({
  name: '',
  logo: '',
  startDate: '',
  endDate: '',
})

const loadCompanies = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getCompanies()
    if (response.status === 200) {
      companies.value = Array.isArray(response.data) ? response.data : [response.data]
    } else {
      error.value = response.message || 'Failed to load companies'
    }
  } catch (err) {
    error.value = err.message || 'Error loading companies'
  } finally {
    loading.value = false
  }
}

const handleCreate = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.createCompany(newCompany.value)
    if (response.status === 201) {
      await loadCompanies()
      cancelCreate()
      alert('Company created successfully!')
    } else {
      error.value = response.message || 'Failed to create company'
    }
  } catch (err) {
    error.value = err.message || 'Error creating company'
  } finally {
    loading.value = false
  }
}

const startEdit = (company) => {
  editingCompany.value = { ...company }
  showCreateForm.value = false
}

const handleUpdate = async () => {
  if (!editingCompany.value._id) return
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateCompany(editingCompany.value._id, editingCompany.value)
    if (response.status === 200) {
      await loadCompanies()
      cancelEdit()
      alert('Company updated successfully!')
    } else {
      error.value = response.message || 'Failed to update company'
    }
  } catch (err) {
    error.value = err.message || 'Error updating company'
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  editingCompany.value = null
}

const toggleDeactivated = async (company) => {
  if (!company._id) return
  
  const action = company.deactivated ? 'activate' : 'deactivate'
  if (!confirm(`Are you sure you want to ${action} "${company.name}"?`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateCompany(company._id, {
      ...company,
      deactivated: !company.deactivated,
    })
    if (response.status === 200) {
      await loadCompanies()
      alert(`Company ${action}d successfully!`)
    } else {
      error.value = response.message || `Failed to ${action} company`
    }
  } catch (err) {
    error.value = err.message || `Error ${action}ing company`
  } finally {
    loading.value = false
  }
}

const handleDelete = async (company) => {
  if (!company._id) return
  
  // Check if company is in use
  if (company.usageCount > 0) {
    alert(`Cannot delete "${company.name}". It is currently used in ${company.usageCount} project(s). Please remove the company from all projects before deleting.`)
    return
  }
  
  if (!confirm(`Are you sure you want to delete "${company.name}"? This action cannot be undone.`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.deleteCompany(company._id)
    if (response.status === 200) {
      await loadCompanies()
      alert('Company deleted successfully!')
    } else {
      error.value = response.message || 'Failed to delete company'
      alert(response.message || 'Failed to delete company')
    }
  } catch (err) {
    error.value = err.message || 'Error deleting company'
    alert(err.message || 'Error deleting company')
  } finally {
    loading.value = false
  }
}

const cancelCreate = () => {
  showCreateForm.value = false
  newCompany.value = {
    name: '',
    logo: '',
    startDate: '',
    endDate: '',
  }
}

onMounted(() => {
  loadCompanies()
})
</script>

<style scoped>
.companies-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-background);
  color: var(--color-text);
  min-height: calc(100vh - 100px);
}

.companies-view h1 {
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

.companies-list {
  margin-top: 2rem;
}

.companies-list h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.companies-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1rem;
}

.company-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.company-card:hover {
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

.btn-delete:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-delete:disabled {
  background-color: #6c757d;
  color: #fff;
  cursor: not-allowed;
  opacity: 0.6;
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

.usage-warning {
  color: #856404;
  background-color: #fff3cd;
  padding: 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  display: inline-block;
  font-size: 0.9rem;
}

.company-card p {
  margin: 0.5rem 0;
  color: var(--color-text);
  line-height: 1.6;
}

.company-card strong {
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

