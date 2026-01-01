<template>
  <div class="about-view">
    <h1>About Management</h1>
    
    <ActionButtons 
      :show-refresh="true"
      :show-create="false"
      @refresh="loadAbout"
    />

    <LoadingState :loading="loading" />
    <ErrorMessage :error="error" />

    <FormContainer v-if="editingAbout || !aboutData" :title="aboutData ? 'Edit About' : 'Create About'">
      <form @submit.prevent="handleUpdate">
        <FormGroup label="Text:">
          <textarea 
            v-model="editingTextInput" 
            rows="15" 
            placeholder="Enter text. Use tabs or two spaces at the start of lines for indentation. Use #id at the end of lines for IDs (e.g., 'Section:#section')"
          ></textarea>
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary">{{ aboutData ? 'Update' : 'Create' }}</Button>
          <Button v-if="aboutData" type="button" variant="secondary" @click="cancelEdit">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <div v-if="aboutData" class="about-display">
      <div class="display-header">
        <h2>Current About</h2>
        <div class="card-actions">
          <Button variant="warning" size="small" @click="startEdit">Edit</Button>
          <Button 
            :variant="aboutData.deactivated ? 'success' : 'warning'" 
            size="small" 
            @click="toggleDeactivated"
          >
            {{ aboutData.deactivated ? 'Activate' : 'Deactivate' }}
          </Button>
        </div>
      </div>
      <DeactivatedBadge :is-deactivated="aboutData.deactivated" />
      <div class="text-display">
        <pre class="text-content">{{ aboutData.text }}</pre>
      </div>
    </div>
    <NoData v-else-if="!loading" message="No about data found" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/services/api'
import ActionButtons from '@/components/ActionButtons.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'
import FormContainer from '@/components/FormContainer.vue'
import FormGroup from '@/components/FormGroup.vue'
import FormActions from '@/components/FormActions.vue'
import Button from '@/components/Button.vue'
import DeactivatedBadge from '@/components/DeactivatedBadge.vue'
import NoData from '@/components/NoData.vue'

const aboutData = ref(null)
const loading = ref(false)
const error = ref(null)
const editingAbout = ref(null)
const editingTextInput = ref('')

const loadAbout = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getAbout()
    if (response.status === 200) {
      aboutData.value = response.data
    } else {
      error.value = response.message || 'Failed to load about data'
    }
  } catch (err) {
    error.value = err.message || 'Error loading about data'
  } finally {
    loading.value = false
  }
}

const startEdit = () => {
  if (aboutData.value) {
    editingAbout.value = { ...aboutData.value }
    // Convert two-space indentation back to tabs for easier editing
    editingTextInput.value = aboutData.value.text ? aboutData.value.text.replace(/^  /gm, '\t') : ''
  } else {
    // If no about data exists, start with empty form
    editingAbout.value = { text: '' }
    editingTextInput.value = ''
  }
}

const handleUpdate = async () => {
  loading.value = true
  error.value = null
  try {
    // Convert tabs to "new line space space" format for storage
    let textString = editingTextInput.value || ''
    // Replace tabs at start of lines with "new line space space"
    textString = textString.replace(/^\t/gm, '  ')
    // Also handle tabs that might be in the middle (convert all tabs to two spaces)
    textString = textString.replace(/\t/g, '  ')
    
    // Use updateAbout (no ID needed - it updates the single about entry)
    const hadExistingData = !!aboutData.value
    const response = await apiService.updateAbout({ text: textString })
    if (response.status === 200) {
      await loadAbout()
      cancelEdit()
      alert(hadExistingData ? 'About updated successfully!' : 'About created successfully!')
    } else {
      error.value = response.message || 'Failed to update about'
    }
  } catch (err) {
    error.value = err.message || 'Error updating about'
  } finally {
    loading.value = false
  }
}

const cancelEdit = () => {
  editingAbout.value = null
  editingTextInput.value = ''
}

const toggleDeactivated = async () => {
  if (!aboutData.value) return
  
  const action = aboutData.value.deactivated ? 'activate' : 'deactivate'
  if (!confirm(`Are you sure you want to ${action} this about page?`)) {
    return
  }
  
  loading.value = true
  error.value = null
  try {
    const response = await apiService.updateAbout({
      deactivated: !aboutData.value.deactivated,
    })
    if (response.status === 200) {
      await loadAbout()
      alert(`About page ${action}d successfully!`)
    } else {
      error.value = response.message || `Failed to ${action} about page`
    }
  } catch (err) {
    error.value = err.message || `Error ${action}ing about page`
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  loadAbout().then(() => {
    // If no about data exists, show the form immediately
    if (!aboutData.value) {
      startEdit()
    }
  })
})
</script>

<style scoped>
.about-view {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  background: var(--color-background);
  color: var(--color-text);
  min-height: calc(100vh - 100px);
}

.about-view h1 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 2rem;
}

.about-display {
  margin-top: 2rem;
}

.display-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.display-header h2 {
  margin: 0;
  color: var(--color-heading);
  font-size: 1.5rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.text-display {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.text-content {
  color: var(--color-text);
  line-height: 1.6;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
  font-family: inherit;
}
</style>
