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
          :categories="projectStore.getCompanies"
          :rarities="projectStore.getRarities"
          :available-types="projectStore.getAvailableTypes"
          @filter="handleFilter"
        />

        <!-- Card Grid -->
        <div class="card-binder" :class="{ blurred: selectedProject }">
          <ProjectCard
            v-for="project in projectStore.getFilteredProjects"
            :key="project.id"
            :project="project"
            :rarity="project.rarity"
            :card-number="project.cardNumber"
            :is-selected="selectedProject?.id === project.id"
            @click="selectCard(project)"
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
  <div v-if="selectedProject" class="card-detail-overlay" @click.self="closeDetail">
    <!-- Card Detail View -->
    <div class="overlay-content">
      <div class="detail-container">
        <!-- Floating Card on Left -->
        <div class="floating-card-wrapper">
          <ProjectCard
            :project="selectedProject"
            :rarity="selectedProject.rarity"
            :card-number="selectedProject.cardNumber"
            :is-floating="true"
            class="floating-card"
          />
        </div>

        <!-- Details Panel on Right -->
        <div class="details-panel">
          <button class="close-button" @click="closeDetail">×</button>
          <div class="panel-content">
            <h1 class="panel-title">{{ selectedProject.title }}</h1>
            <div class="panel-meta">
              <span class="panel-category">{{ selectedProject.company }}</span>
              <span class="panel-dates">{{ selectedProject.startDate }} - {{ selectedProject.endDate }}</span>
            </div>
            
            <div class="panel-section">
              <h2>Description</h2>
              <p>{{ selectedProject.description }}</p>
            </div>

            <div class="panel-section">
              <h2>Key Features</h2>
              <ul>
                <li v-for="(feature, index) in selectedProject.keyFeatures" :key="index">
                  {{ feature }}
                </li>
              </ul>
            </div>

            <div class="panel-section">
              <h2>Tech Stack</h2>
              <div class="tech-stack-panel">
                <span
                  v-for="(tech, index) in selectedProject.stack"
                  :key="index"
                  class="tech-badge"
                >
                  {{ tech }}
                </span>
              </div>
            </div>

            <div v-if="hasLinks(selectedProject)" class="panel-section">
              <h2>Links</h2>
              <div class="links-panel">
                <a
                  v-for="(url, key) in selectedProject.links"
                  :key="key"
                  :href="url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="panel-link"
                >
                  {{ getLinkLabel(key) }}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { projectStore } from '@/stores/projectStore';
import ProjectCard from '@/components/Projects/ProjectCard.vue';
import CollectionFilters from '@/components/Projects/CollectionFilters.vue';
import CollectionStats from '@/components/Projects/CollectionStats.vue';
import Wrapper from '@/components/Wrapper.vue';

const selectedProject = ref(null);

function handleFilter(filters) {
  projectStore.setFilters(filters);
}

function clearFilters() {
  projectStore.clearFilters();
}

function selectCard(project) {
  selectedProject.value = project;
}

function closeDetail() {
  selectedProject.value = null;
}


function hasLinks(project) {
  return project.links && Object.keys(project.links).length > 0;
}

function getLinkLabel(key) {
  const labels = {
    website: 'Visit Website',
    github: 'GitHub',
    android: 'Android App',
    apple: 'iOS App',
    demo: 'Demo',
    about: 'About',
  };
  return labels[key] || key;
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
  transition: filter 0.3s ease;

  &.blurred {
    filter: blur(4px);
    pointer-events: none;
  }
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

// Card Detail Overlay
.card-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: fadeInOverlay 0.3s ease;
  backdrop-filter: blur(2px);
  pointer-events: all;
}

.overlay-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.detail-container {
  width: 90%;
  max-width: 1400px;
  height: 85vh;
  display: flex;
  gap: 2rem;
  align-items: center;
  position: relative;
}

.floating-card-wrapper {
  flex: 0 0 auto;
  width: 350px;
  display: flex;
  justify-content: center;
  align-items: center;
  animation: floatUp 0.5s ease-out;
}

.floating-card {
  transform: scale(1.2);
  z-index: 1001;
}

.details-panel {
  flex: 1;
  height: 100%;
  background: linear-gradient(135deg, #f5e6d3 0%, #e8d5c4 50%, #d4c4b0 100%);
  border: 3px solid #000;
  border-radius: 12px;
  padding: 2rem;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  animation: slideInRight 0.5s ease-out;

  &::-webkit-scrollbar {
    width: 12px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.1);
    border-radius: 6px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(0, 0, 0, 0.3);
    border-radius: 6px;

    &:hover {
      background: rgba(0, 0, 0, 0.5);
    }
  }
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 40px;
  height: 40px;
  border: 2px solid #000;
  border-radius: 50%;
  background: #fff;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  z-index: 10;

  &:hover {
    background: #f44336;
    color: white;
    transform: rotate(90deg);
  }
}

.panel-content {
  padding-right: 1rem;
}

.panel-title {
  font-size: 2.5rem;
  font-weight: bold;
  color: #000;
  margin-bottom: 1rem;
  font-family: 'Times New Roman', serif;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.panel-meta {
  display: flex;
  gap: 2rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(0, 0, 0, 0.2);
  font-size: 0.9rem;
  color: #555;
}

.panel-category {
  font-weight: bold;
  text-transform: uppercase;
}

.panel-section {
  margin-bottom: 2rem;

  h2 {
    font-size: 1.5rem;
    font-weight: bold;
    color: #000;
    margin-bottom: 1rem;
    font-family: 'Times New Roman', serif;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.2);
    padding-bottom: 0.5rem;
  }

  p {
    font-size: 1rem;
    line-height: 1.6;
    color: #333;
    margin: 0;
  }

  ul {
    list-style: none;
    padding: 0;
    margin: 0;

    li {
      padding: 0.5rem 0;
      padding-left: 1.5rem;
      position: relative;
      font-size: 1rem;
      line-height: 1.6;
      color: #333;

      &::before {
        content: '▸';
        position: absolute;
        left: 0;
        color: #000;
        font-weight: bold;
      }
    }
  }
}

.tech-stack-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tech-badge {
  padding: 0.5rem 1rem;
  background: rgba(0, 0, 0, 0.1);
  border: 2px solid #000;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: bold;
  color: #000;
  transition: all 0.2s;

  &:hover {
    background: rgba(0, 0, 0, 0.2);
    transform: translateY(-2px);
  }
}

.links-panel {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.panel-link {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(180deg, #4a7ba7 0%, #3d6b97 100%);
  color: white;
  text-decoration: none;
  border: 2px solid #000;
  border-radius: 25px;
  font-size: 1rem;
  font-weight: bold;
  transition: all 0.2s;
  font-family: 'Times New Roman', serif;

  &:hover {
    background: linear-gradient(180deg, #3d6b97 0%, #2d5a87 100%);
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.3);
  }
}

@keyframes fadeInOverlay {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes floatUp {
  from {
    transform: translateY(100px) scale(1);
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1.2);
    opacity: 1;
  }
}

@keyframes slideInRight {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@media (max-width: 1024px) {
  .detail-container {
    flex-direction: column;
    height: auto;
    max-height: 90vh;
  }

  .floating-card-wrapper {
    width: 280px;
  }

  .floating-card {
    transform: scale(1);
  }

  .details-panel {
    max-height: 60vh;
  }
}
</style>
