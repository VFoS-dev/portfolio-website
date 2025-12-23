<template>
  <div class="collection-background"></div>
  <Wrapper :scroll-top="projectStore.scroll" @scroll="projectStore.updateScroll">
    <div class="pokemon-collection">
      <div class="collection-container">
        <!-- Collection Header -->
        <div class="collection-header">
          <h1>Project Collection</h1>
          <CollectionStats
            :projects="projectStore.getProjects"
            :filtered-count="projectStore.getFilteredProjects.length"
          />
        </div>

        <!-- Filters -->
        <CollectionFilters
          :categories="projectStore.getCategories"
          :rarities="projectStore.getRarities"
          :available-types="projectStore.getAvailableTypes"
          @filter="handleFilter"
        />

        <!-- Card Grid -->
        <div class="card-binder">
          <ProjectCard
            v-for="project in projectStore.getFilteredProjects"
            :key="project.id"
            :project="project"
            :rarity="project.rarity"
            :card-number="project.cardNumber"
          />
        </div>

        <!-- Empty State -->
        <div v-if="projectStore.getFilteredProjects.length === 0" class="empty-state">
          <p>No projects found matching your filters.</p>
          <button class="clear-button" @click="clearFilters">Clear Filters</button>
        </div>
      </div>
    </div>
  </Wrapper>
</template>

<script setup>
import { projectStore } from '@/stores/projectStore';
import ProjectCard from '@/components/Projects/ProjectCard.vue';
import CollectionFilters from '@/components/Projects/CollectionFilters.vue';
import CollectionStats from '@/components/Projects/CollectionStats.vue';
import Wrapper from '@/components/Wrapper.vue';

function handleFilter(filters) {
  projectStore.setFilters(filters);
}

function clearFilters() {
  projectStore.clearFilters();
}
</script>

<style lang="less" scoped>
.collection-background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #d4c4b0 100%);
  background-image:
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.03) 2px,
      rgba(0, 0, 0, 0.03) 4px
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent 2px,
      rgba(0, 0, 0, 0.03) 2px,
      rgba(0, 0, 0, 0.03) 4px
    );
  pointer-events: none;
  z-index: 0;
}

.pokemon-collection {
  width: 100%;
  min-height: 100%;
  position: relative;
  z-index: 1;
}

.collection-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
  padding-bottom: 4rem;
}

.collection-header {
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 3rem;
    font-weight: bold;
    color: #333;
    margin-bottom: 1rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
    font-family: 'Arial', sans-serif;
    letter-spacing: 2px;
  }
}

.card-binder {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 2rem;
  justify-items: center;
  padding: 1rem 0;
  animation: fadeIn 0.5s ease-in;
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;

  p {
    font-size: 1.2rem;
    margin-bottom: 1.5rem;
  }

  .clear-button {
    padding: 0.75rem 2rem;
    background: #2196f3;
    color: white;
    border: none;
    border-radius: 25px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;

    &:hover {
      background: #1976d2;
      transform: translateY(-2px);
      box-shadow: 0 4px 8px rgba(33, 150, 243, 0.3);
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .collection-container {
    padding: 1rem;
  }

  .collection-header h1 {
    font-size: 2rem;
  }

  .card-binder {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 480px) {
  .card-binder {
    grid-template-columns: 1fr;
  }
}
</style>
