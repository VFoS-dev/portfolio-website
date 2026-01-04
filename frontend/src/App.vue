<template>
  <NavBar />
  <CubeRouter>
    <template #home>
      <HomeView />
    </template>
    <template #projects>
      <ProjectsView />
    </template>
    <template #skills>
      <SkillsView />
    </template>
    <template #resume>
      <ResumeView />
    </template>
    <template #about>
      <AboutView />
    </template>
    <template #socials>
      <SocialsView />
    </template>
  </CubeRouter>
</template>

<script setup>
import CubeRouter from '@/router/CubeRouter.vue';
import NavBar from '@/components/Navigation/NavBar.vue';
import { onBeforeUnmount, onMounted, provide, ref } from 'vue';
import provideInject from './enums/provideInject';
import { navStore } from './stores/navStore';

import HomeView from './views/HomeView.vue';
import ProjectsView from './views/ProjectsView.vue';
import SkillsView from './views/SkillsView.vue';
import ResumeView from './views/ResumeView.vue';
import SocialsView from './views/SocialsView.vue';
import AboutView from './views/AboutView.vue';

const isMobile = ref(false);
const isPortrait = ref(false);

provide(provideInject.isMobile, isMobile);
provide(provideInject.isPortrait, isPortrait);

let resizeTimeout = null;

function resized() {
  // Clear any pending resize handler
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }

  // Debounce resize events to prevent flickering
  resizeTimeout = setTimeout(() => {
    const newIsPortrait = window.innerWidth < window.innerHeight;
    const newIsMobile = window.innerWidth < 991;

    // Only update if values actually changed
    if (isPortrait.value !== newIsPortrait) {
      isPortrait.value = newIsPortrait;
      document.documentElement.dataset.rotation = newIsPortrait ? 'portrait' : 'landscape';
    }

    if (isMobile.value !== newIsMobile) {
      isMobile.value = newIsMobile;
      document.documentElement.dataset.mobile = newIsMobile ? 'true' : 'false';
      
      if (!newIsMobile) {
        navStore.toggleOpen(false);
      }
    }
  }, 150); // 150ms debounce
}

onMounted(() => {
  // Set initial values immediately
  const initialIsPortrait = window.innerWidth < window.innerHeight;
  const initialIsMobile = window.innerWidth < 991;
  
  isPortrait.value = initialIsPortrait;
  isMobile.value = initialIsMobile;
  document.documentElement.dataset.rotation = initialIsPortrait ? 'portrait' : 'landscape';
  document.documentElement.dataset.mobile = initialIsMobile ? 'true' : 'false';
  
  addEventListener('resize', resized);
});

onBeforeUnmount(() => {
  if (resizeTimeout) {
    clearTimeout(resizeTimeout);
  }
  removeEventListener('resize', resized);
});
</script>
