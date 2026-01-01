<template>
  <div class="companies-view">
    <h1>Companies Management</h1>
    
    <ActionButtons 
      :show-refresh="true"
      :show-create="true"
      create-label="Create New Company"
      @refresh="loadCompanies"
      @create="showCreateForm = true"
    />

    <LoadingState :loading="loading" />
    <ErrorMessage :error="error" />

    <FormContainer v-if="editingCompany" title="Edit Company">
      <form @submit.prevent="handleUpdate">
        <FormGroup label="Name:">
          <input v-model="editingCompany.name" type="text" required />
        </FormGroup>
        <FormGroup label="Logo:">
          <input v-model="editingCompany.logo" type="text" />
        </FormGroup>
        <FormGroup label="Start Date:">
          <input v-model="editingCompany.startDate" type="text" />
        </FormGroup>
        <FormGroup label="End Date:">
          <input v-model="editingCompany.endDate" type="text" />
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary">Update</Button>
          <Button type="button" variant="secondary" @click="cancelEdit">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <FormContainer v-if="showCreateForm" title="Create New Company">
      <form @submit.prevent="handleCreate">
        <FormGroup label="Name:">
          <input v-model="newCompany.name" type="text" required />
        </FormGroup>
        <FormGroup label="Logo:">
          <input v-model="newCompany.logo" type="text" />
        </FormGroup>
        <FormGroup label="Start Date:">
          <input v-model="newCompany.startDate" type="text" />
        </FormGroup>
        <FormGroup label="End Date:">
          <input v-model="newCompany.endDate" type="text" />
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary">Create</Button>
          <Button type="button" variant="secondary" @click="cancelCreate">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <div v-if="companies && companies.length > 0" class="companies-list">
      <h2>Existing Companies ({{ companies.length }})</h2>
      <div class="companies-grid">
        <DataCard
          v-for="company in companies"
          :key="company._id"
          :title="company.name"
          :is-deactivated="company.deactivated"
          :delete-disabled="company.usageCount > 0"
          :delete-disabled-title="company.usageCount > 0 ? 'Cannot delete: company is in use' : 'Delete company'"
          @edit="startEdit(company)"
          @toggle-deactivate="toggleDeactivated(company)"
          @delete="handleDelete(company)"
        >
          <DeactivatedBadge :is-deactivated="company.deactivated" />
          <p><strong>Usage Count:</strong> {{ company.usageCount || 0 }} project(s)</p>
          <p v-if="company.usageCount > 0" class="usage-warning">⚠️ This company is in use and cannot be deleted</p>
          <p v-if="company.logo"><strong>Logo:</strong> {{ company.logo }}</p>
          <p v-if="company.startDate"><strong>Start Date:</strong> {{ company.startDate }}</p>
          <p v-if="company.endDate"><strong>End Date:</strong> {{ company.endDate }}</p>
        </DataCard>
      </div>
    </div>
    <NoData v-else-if="!loading" message="No companies found" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/services/api'
import { useCrud } from '@/composables/useCrud'
import ActionButtons from '@/components/ActionButtons.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import FormContainer from '@/components/FormContainer.vue'
import FormGroup from '@/components/FormGroup.vue'
import FormActions from '@/components/FormActions.vue'
import Button from '@/components/Button.vue'
import DataCard from '@/components/DataCard.vue'
import DeactivatedBadge from '@/components/DeactivatedBadge.vue'
import NoData from '@/components/NoData.vue'

const {
  items: companies,
  loading,
  error,
  showCreateForm,
  editingItem: editingCompany,
  loadItems: loadCompanies,
  handleCreate: handleCreateBase,
  startEdit,
  handleUpdate: handleUpdateBase,
  cancelEdit,
  toggleDeactivated,
  handleDelete: handleDeleteBase,
  cancelCreate: cancelCreateBase
} = useCrud(apiService, {
  loadMethod: 'getCompanies',
  createMethod: 'createCompany',
  updateMethod: 'updateCompany',
  deleteMethod: 'deleteCompany',
  itemName: 'Company'
})

const newCompany = ref({
  name: '',
  logo: '',
  startDate: '',
  endDate: '',
})

const handleCreate = async () => {
  const success = await handleCreateBase(newCompany.value)
  if (success) {
    resetNewCompany()
  }
}

const handleUpdate = () => {
  handleUpdateBase()
}

const handleDelete = async (company) => {
  // Check if company is in use
  if (company.usageCount > 0) {
    alert(`Cannot delete "${company.name}". It is currently used in ${company.usageCount} project(s). Please remove the company from all projects before deleting.`)
    return
  }
  
  await handleDeleteBase(company)
}

const resetNewCompany = () => {
  newCompany.value = {
    name: '',
    logo: '',
    startDate: '',
    endDate: '',
  }
}

const cancelCreate = () => {
  cancelCreateBase()
  resetNewCompany()
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

.data-card p {
  margin: 0.5rem 0;
  color: var(--color-text);
  line-height: 1.6;
}

.data-card strong {
  color: var(--color-heading);
  font-weight: 600;
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
</style>
