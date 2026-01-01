<template>
  <div class="socials-view">
    <h1>Socials Management</h1>
    
    <ActionButtons 
      :show-refresh="true"
      :show-create="true"
      create-label="Create New Social"
      @refresh="loadSocials"
      @create="showCreateForm = true"
    />

    <LoadingState :loading="loading" />
    <ErrorMessage :error="error" />

    <FormContainer v-if="editingSocial" title="Edit Social">
      <form @submit.prevent="handleUpdate">
        <FormGroup label="Name:">
          <input v-model="editingSocial.name" type="text" required />
        </FormGroup>
        <FormGroup label="Href:">
          <input v-model="editingSocial.href" type="text" />
        </FormGroup>
        <FormGroup label="GIF:">
          <input v-model="editingSocial.gif" type="text" />
        </FormGroup>
        <FormGroup label="Ring:">
          <input v-model="editingSocial.ring" type="text" />
        </FormGroup>
        <FormGroup label="Shadow:">
          <input v-model="editingSocial.shadow" type="text" />
        </FormGroup>
        <h3>Upper</h3>
        <FormGroup label="Upper Fill:">
          <input v-model="editingSocial.upper.fill" type="text" />
        </FormGroup>
        <FormGroup label="Upper Stroke:">
          <input v-model="editingSocial.upper.stroke" type="text" />
        </FormGroup>
        <h3>Lower</h3>
        <FormGroup label="Lower Fill:">
          <input v-model="editingSocial.lower.fill" type="text" />
        </FormGroup>
        <FormGroup label="Lower Stroke:">
          <input v-model="editingSocial.lower.stroke" type="text" />
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary">Update</Button>
          <Button type="button" variant="secondary" @click="cancelEdit">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <FormContainer v-if="showCreateForm" title="Create New Social">
      <form @submit.prevent="handleCreate">
        <FormGroup label="Name:">
          <input v-model="newSocial.name" type="text" required />
        </FormGroup>
        <FormGroup label="Href:">
          <input v-model="newSocial.href" type="text" />
        </FormGroup>
        <FormGroup label="GIF:">
          <input v-model="newSocial.gif" type="text" />
        </FormGroup>
        <FormGroup label="Ring:">
          <input v-model="newSocial.ring" type="text" />
        </FormGroup>
        <FormGroup label="Shadow:">
          <input v-model="newSocial.shadow" type="text" />
        </FormGroup>
        <h3>Upper</h3>
        <FormGroup label="Upper Fill:">
          <input v-model="newSocial.upper.fill" type="text" />
        </FormGroup>
        <FormGroup label="Upper Stroke:">
          <input v-model="newSocial.upper.stroke" type="text" />
        </FormGroup>
        <h3>Lower</h3>
        <FormGroup label="Lower Fill:">
          <input v-model="newSocial.lower.fill" type="text" />
        </FormGroup>
        <FormGroup label="Lower Stroke:">
          <input v-model="newSocial.lower.stroke" type="text" />
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary">Create</Button>
          <Button type="button" variant="secondary" @click="cancelCreate">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <div v-if="socials && socials.length > 0" class="socials-list">
      <h2>Existing Socials ({{ socials.length }})</h2>
      <DataCard
        v-for="social in socials"
        :key="social._id"
        :title="social.name"
        :is-deactivated="social.deactivated"
        @edit="startEdit(social)"
        @toggle-deactivate="toggleDeactivated(social)"
        @delete="handleDelete(social)"
      >
        <DeactivatedBadge :is-deactivated="social.deactivated" />
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
      </DataCard>
    </div>
    <NoData v-else-if="!loading" message="No socials found" />
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
  items: socials,
  loading,
  error,
  showCreateForm,
  editingItem: editingSocial,
  loadItems: loadSocials,
  handleCreate: handleCreateBase,
  startEdit: startEditBase,
  handleUpdate: handleUpdateBase,
  cancelEdit,
  toggleDeactivated,
  handleDelete,
  cancelCreate: cancelCreateBase
} = useCrud(apiService, {
  loadMethod: 'getSocials',
  createMethod: 'createSocial',
  updateMethod: 'updateSocial',
  deleteMethod: 'deleteSocial',
  itemName: 'Social'
})

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

const handleCreate = async () => {
  const success = await handleCreateBase(newSocial.value)
  if (success) {
    resetNewSocial()
  }
}

const startEdit = (social) => {
  startEditBase(social)
  // Ensure nested objects are properly initialized
  if (editingSocial.value) {
    editingSocial.value.upper = editingSocial.value.upper || { fill: '', stroke: '' }
    editingSocial.value.lower = editingSocial.value.lower || { fill: '', stroke: '' }
  }
}

const handleUpdate = () => {
  handleUpdateBase()
}

const resetNewSocial = () => {
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

const cancelCreate = () => {
  cancelCreateBase()
  resetNewSocial()
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

.form-container h3 {
  margin-top: 1.5rem;
  margin-bottom: 1rem;
  color: var(--color-heading);
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-border);
}

.socials-list {
  margin-top: 2rem;
}

.socials-list h2 {
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

.data-card a {
  color: #007bff;
  text-decoration: none;
  word-break: break-all;
}

.data-card a:hover {
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
</style>
