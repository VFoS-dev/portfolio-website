<template>
  <div class="skills-view">
    <h1>Skills Management</h1>
    
    <ActionButtons 
      :show-refresh="true"
      :show-create="true"
      create-label="Create New Skill"
      @refresh="loadSkills"
      @create="showCreateForm = true"
    />

    <LoadingState :loading="loading" />
    <ErrorMessage :error="error" />

    <FormContainer v-if="editingSkill" title="Edit Skill">
      <form @submit.prevent="handleUpdate">
        <FormGroup label="Group:">
          <input v-model="editingSkill.group" type="text" required />
        </FormGroup>
        <FormGroup label="Name:">
          <input v-model="editingSkill.name" type="text" required />
        </FormGroup>
        <FormGroup label="Percent:">
          <input v-model.number="editingSkill.percent" type="number" min="0" max="100" required />
        </FormGroup>
        <FormGroup label="Icon:">
          <input v-model="editingSkill.icon" type="text" placeholder="Icon path or class name" />
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary">Update</Button>
          <Button type="button" variant="secondary" @click="cancelEdit">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <FormContainer v-if="showCreateForm" title="Create New Skill">
      <form @submit.prevent="handleCreate">
        <FormGroup label="Group:">
          <input v-model="newSkill.group" type="text" required />
        </FormGroup>
        <FormGroup label="Name:">
          <input v-model="newSkill.name" type="text" required />
        </FormGroup>
        <FormGroup label="Percent:">
          <input v-model.number="newSkill.percent" type="number" min="0" max="100" required />
        </FormGroup>
        <FormGroup label="Icon:">
          <input v-model="newSkill.icon" type="text" placeholder="Icon path or class name" />
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary">Create</Button>
          <Button type="button" variant="secondary" @click="cancelCreate">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <div v-if="skills && skills.length > 0" class="skills-list">
      <h2>Existing Skills ({{ skills.length }})</h2>
      <div class="skills-grid">
        <DataCard
          v-for="skill in skills"
          :key="skill._id"
          :title="skill.name"
          :is-deactivated="skill.deactivated"
          @edit="startEdit(skill)"
          @toggle-deactivate="toggleDeactivated(skill)"
          @delete="handleDelete(skill)"
        >
          <DeactivatedBadge :is-deactivated="skill.deactivated" />
          <p><strong>Group:</strong> {{ skill.group }}</p>
          <p><strong>Percent:</strong> {{ skill.percent }}%</p>
          <p v-if="skill.icon"><strong>Icon:</strong> {{ skill.icon }}</p>
        </DataCard>
      </div>
    </div>
    <NoData v-else-if="!loading" message="No skills found" />
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
  items: skills,
  loading,
  error,
  showCreateForm,
  editingItem: editingSkill,
  loadItems: loadSkills,
  handleCreate: handleCreateBase,
  startEdit,
  handleUpdate: handleUpdateBase,
  cancelEdit,
  toggleDeactivated,
  handleDelete,
  cancelCreate: cancelCreateBase
} = useCrud(apiService, {
  loadMethod: 'getSkills',
  createMethod: 'createSkill',
  updateMethod: 'updateSkill',
  deleteMethod: 'deleteSkill',
  itemName: 'Skill'
})

const newSkill = ref({
  group: '',
  name: '',
  percent: 0,
  icon: '',
})

const handleCreate = async () => {
  const success = await handleCreateBase(newSkill.value)
  if (success) {
    newSkill.value = {
      group: '',
      name: '',
      percent: 0,
      icon: '',
    }
  }
}

const handleUpdate = () => {
  handleUpdateBase()
}

const cancelCreate = () => {
  cancelCreateBase()
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
