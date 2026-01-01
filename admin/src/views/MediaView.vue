<template>
  <div class="media-view">
    <h1>Media Management</h1>
    
    <ActionButtons 
      :show-refresh="true"
      :show-create="false"
      @refresh="loadMedia"
    >
      <Button variant="success" @click="showUploadForm = true">Upload Media</Button>
    </ActionButtons>

    <LoadingState :loading="loading" />
    <ErrorMessage :error="error" />

    <FormContainer v-if="showUploadForm" title="Upload Media">
      <form @submit.prevent="handleUpload">
        <FormGroup label="Select File (Images or Videos):">
          <input 
            ref="fileInput"
            type="file" 
            @change="handleFileSelect" 
            accept="image/*,video/*"
            required
          />
          <div v-if="selectedFile" class="file-info">
            <p><strong>File:</strong> {{ selectedFile.name }}</p>
            <p><strong>Size:</strong> {{ formatFileSize(selectedFile.size) }}</p>
            <p><strong>Type:</strong> {{ selectedFile.type }}</p>
          </div>
          <div v-if="previewUrl" class="preview-container">
            <img v-if="selectedFile.type.startsWith('image/')" :src="previewUrl" alt="Preview" class="preview-image" />
            <video v-else-if="selectedFile.type.startsWith('video/')" :src="previewUrl" controls class="preview-video" />
          </div>
        </FormGroup>
        <FormActions>
          <Button type="submit" variant="primary" :disabled="uploading">
            {{ uploading ? 'Uploading...' : 'Upload' }}
          </Button>
          <Button type="button" variant="secondary" @click="cancelUpload">Cancel</Button>
        </FormActions>
      </form>
    </FormContainer>

    <div v-if="media && media.length > 0" class="media-list">
      <h2>Uploaded Media ({{ media.length }})</h2>
      <div class="media-grid">
        <div v-for="item in media" :key="item._id" class="media-card">
          <div class="media-preview">
            <img v-if="item.type === 'image'" :src="item.url" :alt="item.originalName" />
            <video v-else-if="item.type === 'video'" :src="item.url" controls></video>
            <div v-else class="file-icon">📄</div>
          </div>
          <div class="media-info">
            <p class="media-name"><strong>{{ item.originalName }}</strong></p>
            <p class="media-url">
              <a :href="item.url" target="_blank" rel="noopener noreferrer">
                {{ truncateUrl(item.url) }}
              </a>
            </p>
            <p class="media-meta">
              <span>{{ item.type }}</span> • 
              <span>{{ formatFileSize(item.size) }}</span> • 
              <span>{{ formatDate(item.createdAt) }}</span>
            </p>
            <div class="media-actions">
              <Button variant="primary" size="small" @click="copyUrl(item.url)">Copy URL</Button>
              <Button variant="danger" size="small" @click="handleDelete(item)">Delete</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <NoData v-else-if="!loading" message="No media found" />
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
import NoData from '@/components/NoData.vue'

const media = ref([])
const loading = ref(false)
const error = ref(null)
const showUploadForm = ref(false)
const selectedFile = ref(null)
const previewUrl = ref(null)
const uploading = ref(false)
const fileInput = ref(null)

const loadMedia = async () => {
  loading.value = true
  error.value = null
  try {
    const response = await apiService.getMedia()
    if (response.status === 200) {
      media.value = Array.isArray(response.data) ? response.data : [response.data]
    } else {
      error.value = response.message || 'Failed to load media'
    }
  } catch (err) {
    error.value = err.message || 'Error loading media'
  } finally {
    loading.value = false
  }
}

const handleFileSelect = (event) => {
  const file = event.target.files[0]
  if (file) {
    selectedFile.value = file
    // Create preview URL
    previewUrl.value = URL.createObjectURL(file)
  }
}

const handleUpload = async () => {
  if (!selectedFile.value) {
    error.value = 'Please select a file'
    return
  }

  uploading.value = true
  error.value = null
  try {
    const response = await apiService.uploadMedia(selectedFile.value)
    if (response.status === 201) {
      await loadMedia()
      cancelUpload()
      alert('Media uploaded successfully!')
    } else {
      error.value = response.message || 'Failed to upload media'
    }
  } catch (err) {
    error.value = err.message || 'Error uploading media'
  } finally {
    uploading.value = false
  }
}

const cancelUpload = () => {
  showUploadForm.value = false
  selectedFile.value = null
  if (previewUrl.value) {
    URL.revokeObjectURL(previewUrl.value)
    previewUrl.value = null
  }
  if (fileInput.value) {
    fileInput.value.value = ''
  }
}

const handleDelete = async (item) => {
  if (!item._id) return
  
  if (!confirm(`Are you sure you want to delete "${item.originalName}"? This action cannot be undone.`)) {
    return
  }

  loading.value = true
  error.value = null
  try {
    const response = await apiService.deleteMedia(item._id)
    if (response.status === 200) {
      await loadMedia()
      alert('Media deleted successfully!')
    } else {
      error.value = response.message || 'Failed to delete media'
    }
  } catch (err) {
    error.value = err.message || 'Error deleting media'
  } finally {
    loading.value = false
  }
}

const copyUrl = (url) => {
  navigator.clipboard.writeText(url).then(() => {
    alert('URL copied to clipboard!')
  }).catch(() => {
    error.value = 'Failed to copy URL'
  })
}

const formatFileSize = (bytes) => {
  if (!bytes) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i]
}

const formatDate = (dateString) => {
  if (!dateString) return ''
  const date = new Date(dateString)
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString()
}

const truncateUrl = (url) => {
  if (!url) return ''
  if (url.length > 50) {
    return url.substring(0, 47) + '...'
  }
  return url
}

onMounted(() => {
  loadMedia()
})
</script>

<style scoped>
.media-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: var(--color-background);
  color: var(--color-text);
  min-height: calc(100vh - 100px);
}

.media-view h1 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 2rem;
}

.form-group input[type="file"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  font-size: 1rem;
  background-color: var(--color-background);
  color: var(--color-text);
}

.file-info {
  margin-top: 1rem;
  padding: 1rem;
  background: var(--color-background);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.file-info p {
  margin: 0.5rem 0;
  color: var(--color-text);
}

.preview-container {
  margin-top: 1rem;
  display: flex;
  justify-content: center;
}

.preview-image {
  max-width: 100%;
  max-height: 400px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.preview-video {
  max-width: 100%;
  max-height: 400px;
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.media-list {
  margin-top: 2rem;
}

.media-list h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.5rem;
}

.media-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.media-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.media-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.media-preview {
  width: 100%;
  height: 200px;
  background: var(--color-background);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.media-preview img,
.media-preview video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.file-icon {
  font-size: 3rem;
}

.media-info {
  padding: 1rem;
}

.media-name {
  margin: 0 0 0.5rem 0;
  color: var(--color-heading);
  font-weight: 600;
  word-break: break-word;
}

.media-url {
  margin: 0.5rem 0;
  font-size: 0.85rem;
}

.media-url a {
  color: #007bff;
  text-decoration: none;
  word-break: break-all;
}

.media-url a:hover {
  text-decoration: underline;
}

.media-meta {
  margin: 0.5rem 0;
  font-size: 0.85rem;
  color: var(--color-text);
  opacity: 0.8;
}

.media-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
</style>
