<template>
  <div class="sabers-view">
    <h1>Sabers Management</h1>
    
    <ActionButtons 
      :show-refresh="true"
      :show-create="true"
      create-label="Create New Saber"
      @refresh="loadSabers"
      @create="showCreateForm = true"
    />

    <LoadingState :loading="loading" />
    <ErrorMessage :error="error" />

    <FormContainer v-if="editingSaber" title="Edit Saber">
      <form @submit.prevent="handleUpdate">
        <FormGroup label="Light Color:">
          <div class="color-input-group">
            <input v-model="editingSaber.lightColor" type="color" class="color-picker" />
            <input v-model="editingSaber.lightColor" type="text" class="color-text" placeholder="#ffffff" />
          </div>
        </FormGroup>
        <FormGroup label="Aura Color:">
          <div class="color-input-group">
            <input v-model="editingSaber.auraColor" type="color" class="color-picker" />
            <input v-model="editingSaber.auraColor" type="text" class="color-text" placeholder="#0000ff" />
          </div>
        </FormGroup>
        <FormGroup label="Inner Color:">
          <div class="color-input-group">
            <input v-model="editingSaber.innerColor" type="color" class="color-picker" />
            <input v-model="editingSaber.innerColor" type="text" class="color-text" placeholder="#ffffff" />
          </div>
        </FormGroup>
        <FormGroup label="Text Color:">
          <div class="color-input-group">
            <input v-model="editingSaber.textColor" type="color" class="color-picker" />
            <input v-model="editingSaber.textColor" type="text" class="color-text" placeholder="#000000" />
          </div>
        </FormGroup>
        <FormGroup label="Preview:">
          <div class="saber-preview-container">
            <div class="saber-preview-hilt"></div>
            <div class="saber-preview-blade" :style="getPreviewStyles(editingSaber)">
              <div class="saber-preview-light"></div>
            </div>
          </div>
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary">Update</Button>
          <Button type="button" variant="secondary" @click="cancelEdit">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <FormContainer v-if="showCreateForm" title="Create New Saber">
      <form @submit.prevent="handleCreate">
        <FormGroup label="Light Color:">
          <div class="color-input-group">
            <input v-model="newSaber.lightColor" type="color" class="color-picker" />
            <input v-model="newSaber.lightColor" type="text" class="color-text" placeholder="#ffffff" />
          </div>
        </FormGroup>
        <FormGroup label="Aura Color:">
          <div class="color-input-group">
            <input v-model="newSaber.auraColor" type="color" class="color-picker" />
            <input v-model="newSaber.auraColor" type="text" class="color-text" placeholder="#0000ff" />
          </div>
        </FormGroup>
        <FormGroup label="Inner Color:">
          <div class="color-input-group">
            <input v-model="newSaber.innerColor" type="color" class="color-picker" />
            <input v-model="newSaber.innerColor" type="text" class="color-text" placeholder="#ffffff" />
          </div>
        </FormGroup>
        <FormGroup label="Text Color:">
          <div class="color-input-group">
            <input v-model="newSaber.textColor" type="color" class="color-picker" />
            <input v-model="newSaber.textColor" type="text" class="color-text" placeholder="#000000" />
          </div>
        </FormGroup>
        <FormGroup label="Preview:">
          <div class="saber-preview-container">
            <div class="saber-preview-hilt"></div>
            <div class="saber-preview-blade" :style="getPreviewStyles(newSaber)">
              <div class="saber-preview-light"></div>
            </div>
          </div>
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary">Create</Button>
          <Button type="button" variant="secondary" @click="cancelCreate">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <div v-if="sabers && sabers.length > 0" class="sabers-list">
      <h2>Existing Sabers ({{ sabers.length }})</h2>
      <div v-for="saber in sabers" :key="saber._id" class="saber-card">
        <div class="saber-preview-container">
          <div class="saber-preview-hilt"></div>
          <div class="saber-preview-blade" :style="getPreviewStyles(saber)">
            <div class="saber-preview-light"></div>
          </div>
        </div>
        <div class="saber-details">
          <div class="card-header">
            <h3>Saber Scheme</h3>
            <div class="card-actions">
              <Button variant="warning" size="small" @click="startEdit(saber)">Edit</Button>
              <Button 
                :variant="saber.deactivated ? 'success' : 'warning'" 
                size="small" 
                @click="toggleDeactivated(saber)"
              >
                {{ saber.deactivated ? 'Activate' : 'Deactivate' }}
              </Button>
              <Button variant="danger" size="small" @click="handleDelete(saber)">Delete</Button>
            </div>
          </div>
          <DeactivatedBadge :is-deactivated="saber.deactivated" />
          <p><strong>Light Color:</strong> {{ saber.lightColor }}</p>
          <p><strong>Aura Color:</strong> {{ saber.auraColor }}</p>
          <p><strong>Inner Color:</strong> {{ saber.innerColor }}</p>
          <p><strong>Text Color:</strong> {{ saber.textColor }}</p>
        </div>
      </div>
    </div>
    <NoData v-else-if="!loading" message="No sabers found" />
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
import DeactivatedBadge from '@/components/DeactivatedBadge.vue'
import NoData from '@/components/NoData.vue'

const {
  items: sabers,
  loading,
  error,
  showCreateForm,
  editingItem: editingSaber,
  loadItems: loadSabersBase,
  handleCreate: handleCreateBase,
  startEdit: startEditBase,
  handleUpdate: handleUpdateBase,
  cancelEdit,
  toggleDeactivated,
  handleDelete,
  cancelCreate: cancelCreateBase
} = useCrud(apiService, {
  loadMethod: 'getSabers',
  createMethod: 'createSaber',
  updateMethod: 'updateSaber',
  deleteMethod: 'deleteSaber',
  itemName: 'Saber'
})

const newSaber = ref({
  lightColor: '#ffffff',
  auraColor: '#0000ff',
  innerColor: '#ffffff',
  textColor: '#000000',
})

// Helper to convert color names to hex
const normalizeColor = (color) => {
  if (!color) return '#ffffff'
  // If it's already a hex color, return it
  if (color.startsWith('#')) return color
  // Convert common color names to hex
  const colorMap = {
    'white': '#ffffff',
    'black': '#000000',
    'red': '#ff0000',
    'green': '#00ff00',
    'blue': '#0000ff',
    'yellow': '#ffff00',
    'orange': '#ffa500',
    'magenta': '#ff00ff',
  }
  return colorMap[color.toLowerCase()] || color
}

const loadSabers = async () => {
  await loadSabersBase()
  // Normalize colors to hex format after loading
  if (sabers.value) {
    sabers.value = sabers.value.map(saber => ({
      ...saber,
      lightColor: normalizeColor(saber.lightColor),
      auraColor: normalizeColor(saber.auraColor),
      innerColor: normalizeColor(saber.innerColor),
      textColor: normalizeColor(saber.textColor),
    }))
  }
}

const handleCreate = async () => {
  const success = await handleCreateBase(newSaber.value)
  if (success) {
    resetNewSaber()
  }
}

const startEdit = (saber) => {
  startEditBase(saber)
  // Normalize colors when editing
  if (editingSaber.value) {
    editingSaber.value.lightColor = normalizeColor(editingSaber.value.lightColor)
    editingSaber.value.auraColor = normalizeColor(editingSaber.value.auraColor)
    editingSaber.value.innerColor = normalizeColor(editingSaber.value.innerColor)
    editingSaber.value.textColor = normalizeColor(editingSaber.value.textColor)
  }
}

const handleUpdate = () => {
  handleUpdateBase()
}

const resetNewSaber = () => {
  newSaber.value = {
    lightColor: '#ffffff',
    auraColor: '#0000ff',
    innerColor: '#ffffff',
    textColor: '#000000',
  }
}

const cancelCreate = () => {
  cancelCreateBase()
  resetNewSaber()
}

const getPreviewStyles = (saber) => {
  if (!saber) return {}
  const lightColor = normalizeColor(saber.lightColor || '#ffffff')
  const innerColor = normalizeColor(saber.innerColor || '#ffffff')
  const auraColor = normalizeColor(saber.auraColor || '#0000ff')
  
  return {
    '--light-color': lightColor,
    '--inner-color': innerColor,
    '--aura-color': auraColor,
  }
}

onMounted(() => {
  loadSabers()
})
</script>

<style scoped>
.sabers-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-background);
  color: var(--color-text);
  min-height: calc(100vh - 100px);
}

.sabers-view h1 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 2rem;
}

.color-input-group {
  display: flex;
  gap: 0.5rem;
  align-items: center;
}

.color-picker {
  width: 60px;
  height: 40px;
  padding: 0;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  cursor: pointer;
  background: none;
}

.color-picker::-webkit-color-swatch-wrapper {
  padding: 0;
}

.color-picker::-webkit-color-swatch {
  border: none;
  border-radius: 4px;
}

.color-text {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
  transition: border-color 0.2s, box-shadow 0.2s;
  font-family: monospace;
}

.color-text:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.sabers-list {
  margin-top: 2rem;
}

.sabers-list h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.saber-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  display: flex;
  gap: 1.5rem;
  align-items: center;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.saber-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.saber-preview-container {
  width: 250px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  position: relative;
  flex-shrink: 0;
  margin-left: 92px;
}

.saber-preview-hilt {
  content: '';
  background-image: url(/images/skills/hilt.png);
  background-repeat: no-repeat;
  background-size: contain;
  width: 92px;
  height: 16px;
  position: absolute;
  left: -92px;
  z-index: 1;
}

.saber-preview-blade {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
}

.saber-preview-light {
  position: absolute;
  height: 40%;
  width: 100%;
  border-radius: 2px 7px 7px 2px;
  background-color: var(--light-color, #ffffff);
  box-shadow:
    0 0 5px var(--inner-color, #ffffff),
    0 0 12px var(--inner-color, #ffffff),
    0 0 15px var(--aura-color, #0000ff),
    0 0 35px var(--aura-color, #0000ff);
}

.saber-details {
  flex: 1;
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

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.saber-details p {
  margin: 0.5rem 0;
  color: var(--color-text);
  line-height: 1.6;
}

.saber-details strong {
  color: var(--color-heading);
  font-weight: 600;
}
</style>
