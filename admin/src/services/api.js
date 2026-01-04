import axios from 'axios'
import { useAuthStore } from '@/stores/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const authStore = useAuthStore()
    const token = authStore.getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Handle 401 errors (unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore()
      authStore.logout()
      // Redirect to login if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Helper to format response
const formatResponse = (response) => {
  // Backend sends { data: ... } or { message: ... } in response body
  // HTTP status code is in response.status
  const body = response.data || {}
  return {
    status: response.status,
    data: body.data || body,
    message: body.message,
  }
}

// API methods for each model
export const apiService = {
  // Auth
  async login(credentials) {
    const response = await api.post('/api/auth/login', credentials)
    return formatResponse(response)
  },
  async verifyToken(token) {
    const response = await api.post('/api/auth/verify', { token })
    return formatResponse(response)
  },
  async changePassword(data) {
    const response = await api.post('/api/auth/change-password', data)
    return formatResponse(response)
  },

  // Icons
  async getIcons() {
    const response = await api.get('/api/icons?beta=1')
    return formatResponse(response)
  },
  async createIcon(data) {
    const response = await api.post('/api/icons', data)
    return formatResponse(response)
  },
  async updateIcon(id, data) {
    const response = await api.put(`/api/icons/${id}`, data)
    return formatResponse(response)
  },
  async deleteIcon(id) {
    const response = await api.delete(`/api/icons/${id}`)
    return formatResponse(response)
  },

  // Projects
  async getProjects() {
    const response = await api.get('/api/projects?beta=1')
    return formatResponse(response)
  },
  async createProject(data) {
    const response = await api.post('/api/projects', data)
    return formatResponse(response)
  },
  async updateProject(id, data) {
    const response = await api.put(`/api/projects/${id}`, data)
    return formatResponse(response)
  },
  async deleteProject(id) {
    const response = await api.delete(`/api/projects/${id}`)
    return formatResponse(response)
  },

  // About
  async getAbout() {
    const response = await api.get('/api/about?beta=1')
    return formatResponse(response)
  },
  async createAbout(data) {
    const response = await api.post('/api/about', data)
    return formatResponse(response)
  },
  async updateAbout(data) {
    const response = await api.put('/api/about', data)
    return formatResponse(response)
  },
  async deleteAbout() {
    const response = await api.delete('/api/about')
    return formatResponse(response)
  },

  // Skills
  async getSkills() {
    const response = await api.get('/api/skills?beta=1')
    return formatResponse(response)
  },
  async createSkill(data) {
    const response = await api.post('/api/skills', data)
    return formatResponse(response)
  },
  async updateSkill(id, data) {
    const response = await api.put(`/api/skills/${id}`, data)
    return formatResponse(response)
  },
  async deleteSkill(id) {
    const response = await api.delete(`/api/skills/${id}`)
    return formatResponse(response)
  },

  // Sabers
  async getSabers() {
    const response = await api.get('/api/sabers?beta=1')
    return formatResponse(response)
  },
  async createSaber(data) {
    const response = await api.post('/api/sabers', data)
    return formatResponse(response)
  },
  async updateSaber(id, data) {
    const response = await api.put(`/api/sabers/${id}`, data)
    return formatResponse(response)
  },
  async deleteSaber(id) {
    const response = await api.delete(`/api/sabers/${id}`)
    return formatResponse(response)
  },

  // Socials
  async getSocials() {
    const response = await api.get('/api/socials?beta=1')
    return formatResponse(response)
  },
  async createSocial(data) {
    const response = await api.post('/api/socials', data)
    return formatResponse(response)
  },
  async updateSocial(id, data) {
    const response = await api.put(`/api/socials/${id}`, data)
    return formatResponse(response)
  },
  async deleteSocial(id) {
    const response = await api.delete(`/api/socials/${id}`)
    return formatResponse(response)
  },

  // Default Window
  async getDefaultWindow() {
    const response = await api.get('/api/default-window?beta=1')
    return formatResponse(response)
  },
  async createDefaultWindow(data) {
    const response = await api.post('/api/default-window', data)
    return formatResponse(response)
  },
  async updateDefaultWindow(data) {
    const response = await api.put('/api/default-window', data)
    return formatResponse(response)
  },
  async deleteDefaultWindow() {
    const response = await api.delete('/api/default-window')
    return formatResponse(response)
  },

  // Companies
  async getCompanies() {
    const response = await api.get('/api/companies?beta=1')
    return formatResponse(response)
  },
  async createCompany(data) {
    const response = await api.post('/api/companies', data)
    return formatResponse(response)
  },
  async updateCompany(id, data) {
    const response = await api.put(`/api/companies/${id}`, data)
    return formatResponse(response)
  },
  async deleteCompany(id) {
    const response = await api.delete(`/api/companies/${id}`)
    return formatResponse(response)
  },

  // Media
  async getMedia() {
    const response = await api.get('/api/media?beta=1')
    return formatResponse(response)
  },
  async uploadMedia(file) {
    const formData = new FormData()
    formData.append('file', file)
    const response = await api.post('/api/media', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return formatResponse(response)
  },
  async updateMedia(id, data) {
    const response = await api.put(`/api/media/${id}`, data)
    return formatResponse(response)
  },
  async deleteMedia(id) {
    const response = await api.delete(`/api/media/${id}`)
    return formatResponse(response)
  },
}

export default apiService

