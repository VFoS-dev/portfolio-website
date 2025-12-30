import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

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
  // Icons
  async getIcons() {
    const response = await api.get('/api/icons')
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
    const response = await api.get('/api/projects')
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
    const response = await api.get('/api/about')
    return formatResponse(response)
  },
  async createAbout(data) {
    const response = await api.post('/api/about', data)
    return formatResponse(response)
  },
  async updateAbout(id, data) {
    const response = await api.put(`/api/about/${id}`, data)
    return formatResponse(response)
  },
  async deleteAbout(id) {
    const response = await api.delete(`/api/about/${id}`)
    return formatResponse(response)
  },

  // Skills
  async getSkills() {
    const response = await api.get('/api/skills')
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

  // Colors
  async getColors() {
    const response = await api.get('/api/colors')
    return formatResponse(response)
  },
  async createColor(data) {
    const response = await api.post('/api/colors', data)
    return formatResponse(response)
  },
  async updateColor(id, data) {
    const response = await api.put(`/api/colors/${id}`, data)
    return formatResponse(response)
  },
  async deleteColor(id) {
    const response = await api.delete(`/api/colors/${id}`)
    return formatResponse(response)
  },

  // Socials
  async getSocials() {
    const response = await api.get('/api/socials')
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
    const response = await api.get('/api/default-window')
    return formatResponse(response)
  },
  async createDefaultWindow(data) {
    const response = await api.post('/api/default-window', data)
    return formatResponse(response)
  },
  async updateDefaultWindow(id, data) {
    const response = await api.put(`/api/default-window/${id}`, data)
    return formatResponse(response)
  },
  async deleteDefaultWindow(id) {
    const response = await api.delete(`/api/default-window/${id}`)
    return formatResponse(response)
  },
}

export default apiService

