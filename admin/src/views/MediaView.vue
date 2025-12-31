<template>
  <div class="media-view">
    <h1>Media Management</h1>
    
    <div class="actions">
      <button @click="loadMedia" class="btn btn-primary">Refresh</button>
      <button @click="showUploadForm = true" class="btn btn-success">Upload Media</button>
    </div>

    <div v-if="loading" class="loading">Loading...</div>
    <div v-if="error" class="error">{{ error }}</div>

    <div v-if="showUploadForm" class="form-container">
      <h2>Upload Media</h2>
      <form @submit.prevent="handleUpload">
        <div class="form-group">
          <label>Select File (Images or Videos):</label>
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
        </div>
        <div class="form-actions">
          <button type="submit" class="btn btn-primary" :disabled="uploading">
            {{ uploading ? 'Uploading...' : 'Upload' }}
          </button>
          <button type="button" @click="cancelUpload" class="btn btn-secondary">Cancel</button>
        </div>
      </form>
    </div>

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
              <button @click="copyUrl(item.url)" class="btn btn-small">Copy URL</button>
              <button @click="handleDelete(item)" class="btn btn-small btn-delete">Delete</button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div v-else-if="!loading" class="no-data">No media found</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import apiService from '@/services/api'

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

.btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: #0056b3;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover:not(:disabled) {
  background-color: #218838;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(:disabled) {
  background-color: #5a6268;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background-color: #c82333;
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

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
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

