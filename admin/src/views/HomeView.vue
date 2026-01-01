<template>
  <div class="home-view">
    <h1>Admin Dashboard</h1>
    <p class="subtitle">Manage your portfolio data</p>
    
    <div class="dashboard-grid">
      <DashboardCard 
        to="/projects"
        title="Projects"
        description="Manage portfolio projects"
      />
      
      <DashboardCard 
        to="/icons"
        title="Icons"
        description="Manage desktop icons"
      />
      
      <DashboardCard 
        to="/about"
        title="About"
        description="Manage about data"
      />
      
      <DashboardCard 
        to="/skills"
        title="Skills"
        description="Manage skills and proficiencies"
      />
      
      <DashboardCard 
        to="/sabers"
        title="Sabers"
        description="Manage color schemes"
      />
      
      <DashboardCard 
        to="/socials"
        title="Socials"
        description="Manage social media links"
      />
      
      <DashboardCard 
        to="/default-window"
        title="Default Window"
        description="Manage default window settings"
      />
      
      <DashboardCard 
        to="/companies"
        title="Companies"
        description="Manage companies and organizations"
      />
      
      <DashboardCard 
        to="/media"
        title="Media"
        description="Upload and manage images and videos"
      />
    </div>
  </div>
</template>

<script setup>
import DashboardCard from '@/components/DashboardCard.vue'
</script>

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

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
  }
}
</style>
