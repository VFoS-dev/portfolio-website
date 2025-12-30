import { ref, computed } from 'vue'

const token = ref(localStorage.getItem('auth_token') || null)
const user = ref(JSON.parse(localStorage.getItem('auth_user') || 'null'))

export function useAuthStore() {
  const isAuthenticated = computed(() => !!token.value)

  function setToken(newToken) {
    token.value = newToken
    if (newToken) {
      localStorage.setItem('auth_token', newToken)
    } else {
      localStorage.removeItem('auth_token')
    }
  }

  function setUser(newUser) {
    user.value = newUser
    if (newUser) {
      localStorage.setItem('auth_user', JSON.stringify(newUser))
    } else {
      localStorage.removeItem('auth_user')
    }
  }

  function logout() {
    setToken(null)
    setUser(null)
  }

  function getToken() {
    return token.value
  }

  function getUser() {
    return user.value
  }

  return {
    token,
    user,
    isAuthenticated,
    setToken,
    setUser,
    logout,
    getToken,
    getUser,
  }
}

