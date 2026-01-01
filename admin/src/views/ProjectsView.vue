<template>
  <div class="projects-view">
    <h1>Projects Management</h1>
    
    <ActionButtons 
      :show-refresh="true"
      :show-create="true"
      create-label="Create New Project"
      @refresh="loadProjects"
      @create="showCreateForm = true"
    />

    <LoadingState :loading="loading" />
    <ErrorMessage :error="error" />

    <FormContainer v-if="editingProject" title="Edit Project">
      <form @submit.prevent="handleUpdate">
        <FormGroup label="ID:">
          <input v-model="editingProject.id" type="text" required />
        </FormGroup>
        <FormGroup label="Title:">
          <input v-model="editingProject.title" type="text" required />
        </FormGroup>
        <FormGroup label="Image:">
          <input v-model="editingProject.img" type="text" />
        </FormGroup>
        <FormGroup label="Description:">
          <textarea v-model="editingProject.description" rows="3"></textarea>
        </FormGroup>
        <FormGroup label="Stack:">
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
        </FormGroup>
        <FormGroup label="Key Features (comma-separated):">
          <input v-model="editingFeaturesInput" type="text" placeholder="Feature 1, Feature 2" />
        </FormGroup>
        <FormGroup label="Start Date:">
          <input v-model="editingProject.startDate" type="text" />
        </FormGroup>
        <FormGroup label="End Date:">
          <input v-model="editingProject.endDate" type="text" />
        </FormGroup>
        <FormGroup label="Company:">
          <select v-model="editingProject.company">
            <option :value="null">No Company</option>
            <option v-for="company in companies" :key="company._id" :value="company._id">
              {{ company.name }}
            </option>
          </select>
        </FormGroup>
        <FormGroup label="Type:">
          <input v-model="editingProject.type" type="text" />
        </FormGroup>
        <FormGroup label="Secondary Type:">
          <input v-model="editingProject.secondaryType" type="text" />
        </FormGroup>
        <FormGroup label="Card Number:">
          <input v-model.number="editingProject.cardNumber" type="number" />
        </FormGroup>
        <FormGroup label="Deprecated">
          <label>
            <input v-model="editingProject.deprecated" type="checkbox" />
            Deprecated
          </label>
        </FormGroup>
        <FormGroup label="Rarity:">
          <input v-model="editingProject.rarity" type="text" />
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary">Update</Button>
          <Button type="button" variant="secondary" @click="cancelEdit">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <FormContainer v-if="showCreateForm" title="Create New Project">
      <form @submit.prevent="handleCreate">
        <FormGroup label="ID:">
          <input v-model="newProject.id" type="text" required />
        </FormGroup>
        <FormGroup label="Title:">
          <input v-model="newProject.title" type="text" required />
        </FormGroup>
        <FormGroup label="Image:">
          <input v-model="newProject.img" type="text" />
        </FormGroup>
        <FormGroup label="Description:">
          <textarea v-model="newProject.description" rows="3"></textarea>
        </FormGroup>
        <FormGroup label="Stack:">
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
        </FormGroup>
        <FormGroup label="Key Features (comma-separated):">
          <input v-model="featuresInput" type="text" placeholder="Feature 1, Feature 2" />
        </FormGroup>
        <FormGroup label="Start Date:">
          <input v-model="newProject.startDate" type="text" />
        </FormGroup>
        <FormGroup label="End Date:">
          <input v-model="newProject.endDate" type="text" />
        </FormGroup>
        <FormGroup label="Company:">
          <select v-model="newProject.company">
            <option :value="null">No Company</option>
            <option v-for="company in companies" :key="company._id" :value="company._id">
              {{ company.name }}
            </option>
          </select>
        </FormGroup>
        <FormGroup label="Type:">
          <input v-model="newProject.type" type="text" />
        </FormGroup>
        <FormGroup label="Secondary Type:">
          <input v-model="newProject.secondaryType" type="text" />
        </FormGroup>
        <FormGroup label="Card Number:">
          <input v-model.number="newProject.cardNumber" type="number" />
        </FormGroup>
        <FormGroup label="Deprecated">
          <label>
            <input v-model="newProject.deprecated" type="checkbox" />
            Deprecated
          </label>
        </FormGroup>
        <FormGroup label="Rarity:">
          <input v-model="newProject.rarity" type="text" />
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary">Create</Button>
          <Button type="button" variant="secondary" @click="cancelCreate">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <div v-if="projects && projects.length > 0" class="projects-list">
      <h2>Existing Projects ({{ projects.length }})</h2>
      <DataCard
        v-for="project in projects"
        :key="project._id || project.id"
        :title="project.title"
        :is-deactivated="project.deactivated"
        @edit="startEdit(project)"
        @toggle-deactivate="toggleDeactivated(project)"
        @delete="handleDelete(project)"
      >
        <p><strong>ID:</strong> {{ project.id }}</p>
        <DeactivatedBadge :is-deactivated="project.deactivated" />
        <p><strong>Company:</strong> {{ project.company?.name || 'No Company' }}</p>
        <p><strong>Type:</strong> {{ project.type }}</p>
        <p><strong>Card Number:</strong> {{ project.cardNumber }}</p>
        <p v-if="project.description"><strong>Description:</strong> {{ project.description }}</p>
        <p v-if="project.stack && project.stack.length > 0"><strong>Stack:</strong> {{ project.stack.map(s => s.name || s).join(', ') }}</p>
      </DataCard>
    </div>
    <NoData v-else-if="!loading" message="No projects found" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import apiService from '@/services/api'
import { useCrud } from '@/composables/useCrud'
import StackInput from '@/components/StackInput.vue'
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
  items: projects,
  loading,
  error,
  showCreateForm,
  editingItem: editingProject,
  loadItems: loadProjectsBase,
  handleCreate: handleCreateBase,
  startEdit: startEditBase,
  handleUpdate: handleUpdateBase,
  cancelEdit: cancelEditBase,
  toggleDeactivated,
  handleDelete,
  cancelCreate: cancelCreateBase
} = useCrud(apiService, {
  loadMethod: 'getProjects',
  createMethod: 'createProject',
  updateMethod: 'updateProject',
  deleteMethod: 'deleteProject',
  itemName: 'Project'
})

const companies = ref([])
const skills = ref([])
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
  await loadProjectsBase()
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

const handleStackEnter = (searchValue) => {
  console.log('Enter pressed with search value:', searchValue)
}

const handleCreate = async () => {
  const success = await handleCreateBase(newProject.value)
  if (success) {
    resetNewProject()
  }
}

const startEdit = (project) => {
  startEditBase(project)
  // Transform project data for editing
  if (editingProject.value) {
    editingProject.value.company = project.company?._id || project.company || null
    editingProject.value.stack = project.stack ? (Array.isArray(project.stack) ? project.stack.map(s => s._id || s) : []) : []
    editingFeaturesInput.value = project.keyFeatures ? project.keyFeatures.join(', ') : ''
  }
}

const handleUpdate = () => {
  handleUpdateBase()
}

const cancelEdit = () => {
  cancelEditBase()
  editingFeaturesInput.value = ''
}

const resetNewProject = () => {
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

const cancelCreate = () => {
  cancelCreateBase()
  resetNewProject()
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

.projects-list {
  margin-top: 2rem;
}

.projects-list h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.5rem;
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
</style>
