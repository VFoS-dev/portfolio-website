<template>
  <div class="collection-background"></div>
  <Wrapper :scroll-top="projectStore.scroll" @scroll="projectStore.updateScroll">
    <div class="trading-card-collection">
      <div class="collection-container">
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
          <p>No projects found.</p>
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
          <div class="card-details">
            <!-- Header Section -->
            <div class="details-header">
              <h1 class="card-name">{{ selectedProject.title }}</h1>
              <div class="card-meta">
                <div class="meta-item">
                  <span class="meta-label">Company:</span>
                  <span class="meta-value">{{ selectedProject.company }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Period:</span>
                  <span class="meta-value">{{ selectedProject.startDate }} — {{ selectedProject.endDate }}</span>
                </div>
                <div class="meta-item">
                  <span class="meta-label">Type:</span>
                  <span class="meta-value">{{ selectedProject.type }}</span>
                </div>
              </div>
            </div>

            <!-- Attributes Grid -->
            <div class="attributes-grid">
              <!-- Left Column -->
              <div class="attributes-column">
                <div class="attribute-group">
                  <div class="attribute-item">
                    <span class="attribute-label">Description</span>
                    <div class="attribute-value description-text">{{ selectedProject.description }}</div>
                  </div>
                </div>

                <div v-if="hasLinks(selectedProject)" class="attribute-group">
                  <div class="attribute-item">
                    <span class="attribute-label">Links</span>
                    <div class="links-list">
                      <a
                        v-for="(url, key) in selectedProject.links"
                        :key="key"
                        :href="url"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="detail-link"
                      >
                        {{ getLinkLabel(key) }}
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Right Column -->
              <div class="attributes-column">
                <div class="attribute-group">
                  <div class="attribute-item">
                    <span class="attribute-label">Key Features</span>
                    <div class="features-list">
                      <div
                        v-for="(feature, index) in selectedProject.keyFeatures"
                        :key="index"
                        class="feature-item"
                      >
                        {{ feature }}
                      </div>
                    </div>
                  </div>
                </div>

                <div class="attribute-group">
                  <div class="attribute-item">
                    <span class="attribute-label">Tech Stack</span>
                    <div class="tech-list">
                      <span
                        v-for="(tech, index) in selectedProject.stack"
                        :key="index"
                        class="tech-tag"
                      >
                        {{ tech }}
                      </span>
                    </div>
                  </div>
                </div>
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
import Wrapper from '@/components/Wrapper.vue';

const selectedProject = ref(null);

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
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 30%, #0f3460 60%, #1a1a2e 100%);
  background-image:
    radial-gradient(circle at 20% 30%, rgba(74, 158, 255, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 80% 70%, rgba(255, 107, 107, 0.15) 0%, transparent 50%),
    radial-gradient(circle at 50% 50%, rgba(255, 212, 59, 0.12) 0%, transparent 60%);
  pointer-events: none;
  z-index: -1;
}

.trading-card-collection {
  width: 100%;
  min-height: 100%;
  position: relative;
  z-index: 1;
}

.collection-container {
  max-width: 1800px;
  margin: 0 auto;
  padding: 1.5rem 1rem;
  padding-bottom: 3rem;
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
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 2rem;
  justify-items: center;
  padding: 1rem 0;

  &.blurred {
    filter: blur(5px) brightness(0.9);
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

    &:hover {
      background: #1976d2;
    }
  }
}


@media (max-width: 1400px) {
  .collection-container {
    max-width: 100%;
    padding: 1.5rem 1rem;
  }

  .card-binder {
    grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
    gap: 1.75rem;
  }
}

@media (max-width: 1024px) {
  .collection-container {
    padding: 1.25rem 0.75rem;
  }

  .card-binder {
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .collection-container {
    padding: 1rem 0.5rem;
  }

  .card-binder {
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 1.25rem;
    padding: 0.75rem 0;
  }
}

@media (max-width: 480px) {
  .collection-container {
    padding: 0.75rem 0.5rem;
  }

  .card-binder {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}

// Card Detail Overlay
.card-detail-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(8px);
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
}

.floating-card {
  transform: scale(1.2);
  z-index: 1001;
}

.details-panel {
  flex: 1;
  height: 100%;
  background: #2a2a2a;
  border: none;
  border-radius: 0;
  padding: 0;
  overflow-y: auto;
  position: relative;

  &::-webkit-scrollbar {
    width: 10px;
  }

  &::-webkit-scrollbar-track {
    background: rgba(255, 255, 255, 0.05);
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(255, 255, 255, 0.2);
    border-radius: 5px;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }
}

.close-button {
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  font-size: 1.5rem;
  line-height: 1;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
  font-weight: normal;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
    color: #ffffff;
  }
}

.card-details {
  padding: 2rem;
  position: relative;
  z-index: 1;
  min-height: 100%;
  color: #e0e0e0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

.details-header {
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.card-name {
  font-size: 1.75rem;
  font-weight: 600;
  color: #ffffff;
  margin: 0 0 1rem 0;
  line-height: 1.2;
}

.card-meta {
  display: flex;
  gap: 2rem;
  flex-wrap: wrap;
}

.meta-item {
  display: flex;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.meta-label {
  color: #b0b0b0;
  font-weight: 500;
}

.meta-value {
  color: #e0e0e0;
  font-weight: 400;
}

.attributes-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.attributes-column {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.attribute-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.attribute-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.attribute-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  color: #b0b0b0;
  margin-bottom: 0.25rem;
}

.attribute-value {
  font-size: 0.95rem;
  color: #e0e0e0;
  line-height: 1.6;
  font-weight: 400;
}

.description-text {
  line-height: 1.7;
  color: #d0d0d0;
}

.features-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.feature-item {
  font-size: 0.9rem;
  color: #e0e0e0;
  line-height: 1.6;
  padding-left: 1rem;
  position: relative;

  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: #888;
  }
}

.tech-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.tech-tag {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  font-size: 0.85rem;
  color: #e0e0e0;

  &:hover {
    background: rgba(255, 255, 255, 0.12);
    border-color: rgba(255, 255, 255, 0.2);
  }
}

.links-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.detail-link {
  display: inline-block;
  padding: 0.5rem 0.75rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 4px;
  text-decoration: none;
  color: #4a9eff;
  font-size: 0.9rem;
  text-align: left;

  &:hover {
    background: rgba(74, 158, 255, 0.15);
    border-color: rgba(74, 158, 255, 0.3);
    color: #6bb0ff;
  }
}


.links-panel {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.panel-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.25rem;
  background: #1a1a1a;
  color: #ffffff;
  text-decoration: none;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  width: fit-content;

  .link-icon {
    opacity: 0.7;
  }

  &:hover {
    background: #0a0a0a;
    
    .link-icon {
      opacity: 1;
    }
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

  .sheet-body {
    grid-template-columns: 1fr;
  }

  .header-stats {
    grid-template-columns: 1fr;
  }
}
</style>
