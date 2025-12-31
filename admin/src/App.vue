<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const handleLogout = () => {
  authStore.logout()
  router.push('/login')
}
</script>

<template>
  <div class="app">
    <header v-if="authStore.isAuthenticated">
      <div class="header-content">
        <h1>Portfolio Admin</h1>
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/projects">Projects</RouterLink>
          <RouterLink to="/icons">Icons</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/skills">Skills</RouterLink>
          <RouterLink to="/colors">Colors</RouterLink>
          <RouterLink to="/socials">Socials</RouterLink>
          <RouterLink to="/default-window">Default Window</RouterLink>
          <RouterLink to="/companies">Companies</RouterLink>
          <RouterLink to="/change-password">Change Password</RouterLink>
          <button @click="handleLogout" class="btn-logout">Logout</button>
        </nav>
      </div>
    </header>

    <main>
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

header {
  background-color: #2c3e50;
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

header h1 {
  margin: 0;
  font-size: 1.5rem;
}

nav {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

nav a {
  padding: 0.5rem 1rem;
  text-decoration: none;
  color: white;
  border-radius: 4px;
  transition: background-color 0.2s;
}

nav a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

nav a.router-link-exact-active {
  background-color: #3498db;
  font-weight: bold;
}

.btn-logout {
  padding: 0.5rem 1rem;
  background-color: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.2s;
  margin-left: 0.5rem;
}

.btn-logout:hover {
  background-color: #c82333;
}

main {
  flex: 1;
  background-color: #f5f5f5;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    align-items: flex-start;
  }

  nav {
    width: 100%;
    margin-top: 1rem;
  }

  nav a {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
