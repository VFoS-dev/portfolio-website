<template>
  <div class="icons-view">
    <h1>Icons Management</h1>
    
    <ActionButtons 
      :show-refresh="true"
      :show-create="true"
      create-label="Create New Icon"
      @refresh="loadIcons"
      @create="showCreateForm = true"
    />

    <LoadingState :loading="loading" />
    <ErrorMessage :error="error" />

    <FormContainer v-if="editingIcon" title="Edit Icon">
      <form @submit.prevent="handleUpdate">
        <FormGroup label="Title:">
          <input v-model="editingIcon.title" type="text" required />
        </FormGroup>
        <FormGroup label="Desktop Icon:">
          <input v-model="editingIcon['desktop-icon']" type="text" />
        </FormGroup>
        <FormGroup label="Icon:">
          <input v-model="editingIcon.icon" type="text" />
        </FormGroup>
        <FormGroup label="App:">
          <input v-model="editingIcon.app" type="text" />
        </FormGroup>
        <FormGroup label="X:">
          <input v-model="editingIcon.x" type="text" />
        </FormGroup>
        <FormGroup label="Y:">
          <input v-model="editingIcon.y" type="text" />
        </FormGroup>
        <FormGroup label="Width:">
          <input v-model="editingIcon.width" type="text" />
        </FormGroup>
        <FormGroup label="Height:">
          <input v-model="editingIcon.height" type="text" />
        </FormGroup>
        <FormGroup label="Is Trash">
          <label>
            <input v-model="editingIcon.isTrash" type="checkbox" />
            Is Trash
          </label>
        </FormGroup>
        <FormGroup label="App Props (JSON):">
          <textarea v-model="editingAppPropsInput" rows="4" placeholder='{"key": "value"}'></textarea>
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary">Update</Button>
          <Button type="button" variant="secondary" @click="cancelEdit">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <FormContainer v-if="showCreateForm" title="Create New Icon">
      <form @submit.prevent="handleCreate">
        <FormGroup label="Title:">
          <input v-model="newIcon.title" type="text" required />
        </FormGroup>
        <FormGroup label="Desktop Icon:">
          <input v-model="newIcon['desktop-icon']" type="text" />
        </FormGroup>
        <FormGroup label="Icon:">
          <input v-model="newIcon.icon" type="text" />
        </FormGroup>
        <FormGroup label="App:">
          <input v-model="newIcon.app" type="text" />
        </FormGroup>
        <FormGroup label="X:">
          <input v-model="newIcon.x" type="text" />
        </FormGroup>
        <FormGroup label="Y:">
          <input v-model="newIcon.y" type="text" />
        </FormGroup>
        <FormGroup label="Width:">
          <input v-model="newIcon.width" type="text" />
        </FormGroup>
        <FormGroup label="Height:">
          <input v-model="newIcon.height" type="text" />
        </FormGroup>
        <FormGroup label="Is Trash">
          <label>
            <input v-model="newIcon.isTrash" type="checkbox" />
            Is Trash
          </label>
        </FormGroup>
        <FormGroup label="App Props (JSON):">
          <textarea v-model="appPropsInput" rows="4" placeholder='{"key": "value"}'></textarea>
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary">Create</Button>
          <Button type="button" variant="secondary" @click="cancelCreate">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <div v-if="icons && icons.length > 0" class="icons-list">
      <h2>Existing Icons ({{ icons.length }})</h2>
      <DataCard
        v-for="icon in icons"
        :key="icon._id"
        :title="icon.title"
        :is-deactivated="icon.deactivated"
        @edit="startEdit(icon)"
        @toggle-deactivate="toggleDeactivated(icon)"
        @delete="handleDelete(icon)"
      >
        <DeactivatedBadge :is-deactivated="icon.deactivated" />
        <p><strong>App:</strong> {{ icon.app }}</p>
        <p><strong>Position:</strong> ({{ icon.x }}, {{ icon.y }})</p>
        <p><strong>Size:</strong> {{ icon.width }} x {{ icon.height }}</p>
        <p><strong>Is Trash:</strong> {{ icon.isTrash ? 'Yes' : 'No' }}</p>
      </DataCard>
    </div>
    <NoData v-else-if="!loading" message="No icons found" />
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
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
  items: icons,
  loading,
  error,
  showCreateForm,
  editingItem: editingIcon,
  loadItems: loadIconsBase,
  handleCreate: handleCreateBase,
  startEdit: startEditBase,
  handleUpdate: handleUpdateBase,
  cancelEdit: cancelEditBase,
  toggleDeactivated,
  handleDelete,
  cancelCreate: cancelCreateBase
} = useCrud(apiService, {
  loadMethod: 'getIcons',
  createMethod: 'createIcon',
  updateMethod: 'updateIcon',
  deleteMethod: 'deleteIcon',
  itemName: 'Icon'
})

const appPropsInput = ref('{}')
const editingAppPropsInput = ref('{}')

const newIcon = ref({
  title: '',
  'desktop-icon': '',
  icon: '',
  app: '',
  x: '',
  y: '',
  width: '',
  height: '',
  isTrash: false,
  appProps: {},
})

watch(appPropsInput, (val) => {
  try {
    newIcon.value.appProps = val ? JSON.parse(val) : {}
  } catch (e) {
    // Invalid JSON, keep previous value
  }
})

watch(editingAppPropsInput, (val) => {
  if (editingIcon.value) {
    try {
      editingIcon.value.appProps = val ? JSON.parse(val) : {}
    } catch (e) {
      // Invalid JSON, keep previous value
    }
  }
})

const loadIcons = async () => {
  await loadIconsBase()
}

const handleCreate = async () => {
  const success = await handleCreateBase(newIcon.value)
  if (success) {
    resetNewIcon()
  }
}

const startEdit = (icon) => {
  startEditBase(icon)
  editingAppPropsInput.value = JSON.stringify(icon.appProps || {}, null, 2)
}

const handleUpdate = () => {
  handleUpdateBase()
}

const cancelEdit = () => {
  cancelEditBase()
  editingAppPropsInput.value = '{}'
}

const resetNewIcon = () => {
  newIcon.value = {
    title: '',
    'desktop-icon': '',
    icon: '',
    app: '',
    x: '',
    y: '',
    width: '',
    height: '',
    isTrash: false,
    appProps: {},
  }
  appPropsInput.value = '{}'
}

const cancelCreate = () => {
  cancelCreateBase()
  resetNewIcon()
}

onMounted(() => {
  loadIcons()
})
</script>

<style scoped>
.icons-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-background);
  color: var(--color-text);
  min-height: calc(100vh - 100px);
}

.icons-view h1 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 2rem;
}

.icons-list {
  margin-top: 2rem;
}

.icons-list h2 {
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
