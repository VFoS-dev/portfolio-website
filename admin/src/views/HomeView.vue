<script setup>
import { RouterLink } from 'vue-router'
</script>

<template>
  <div class="home-view">
    <h1>Admin Dashboard</h1>
    <p class="subtitle">Manage your portfolio data</p>
    
    <div class="dashboard-grid">
      <RouterLink to="/projects" class="dashboard-card">
        <h2>Projects</h2>
        <p>Manage portfolio projects</p>
      </RouterLink>
      
      <RouterLink to="/icons" class="dashboard-card">
        <h2>Icons</h2>
        <p>Manage desktop icons</p>
      </RouterLink>
      
      <RouterLink to="/about" class="dashboard-card">
        <h2>About</h2>
        <p>Manage about data</p>
      </RouterLink>
      
      <RouterLink to="/skills" class="dashboard-card">
        <h2>Skills</h2>
        <p>Manage skills and proficiencies</p>
      </RouterLink>
      
      <RouterLink to="/sabers" class="dashboard-card">
        <h2>Sabers</h2>
        <p>Manage color schemes</p>
      </RouterLink>
      
      <RouterLink to="/socials" class="dashboard-card">
        <h2>Socials</h2>
        <p>Manage social media links</p>
      </RouterLink>
      
      <RouterLink to="/default-window" class="dashboard-card">
        <h2>Default Window</h2>
        <p>Manage default window settings</p>
      </RouterLink>
      
      <RouterLink to="/companies" class="dashboard-card">
        <h2>Companies</h2>
        <p>Manage companies and organizations</p>
      </RouterLink>
      
      <RouterLink to="/media" class="dashboard-card">
        <h2>Media</h2>
        <p>Upload and manage images and videos</p>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.home-view {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  background: var(--color-background);
  color: var(--color-text);
  min-height: calc(100vh - 100px);
}

h1 {
  margin-bottom: 0.5rem;
  color: var(--color-heading);
  font-size: 2rem;
}

.subtitle {
  color: var(--color-text);
  margin-bottom: 2rem;
  font-size: 1.1rem;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.dashboard-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.dashboard-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  border-color: #3498db;
}

.dashboard-card h2 {
  margin: 0 0 0.5rem 0;
  color: var(--color-heading);
  font-size: 1.5rem;
}

.dashboard-card p {
  margin: 0;
  color: var(--color-text);
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
