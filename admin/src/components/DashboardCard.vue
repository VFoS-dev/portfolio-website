<template>
  <RouterLink :to="to" class="dashboard-card">
    <h2>{{ title }}</h2>
    <p>{{ description }}</p>
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  to: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
})
</script>

<style scoped>
.dashboard-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 2rem;
  text-decoration: none;
  color: inherit;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: block;
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
</style>

