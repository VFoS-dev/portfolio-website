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
import { onMounted, provide, ref } from 'vue';
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

function resized() {
  if ((isPortrait.value = window.innerWidth < window.innerHeight)) {
    document.documentElement.dataset.rotation = 'portrait';
  } else {
    document.documentElement.dataset.rotation = 'landscape';
  }

  if ((isMobile.value = window.innerWidth < 991)) {
    document.documentElement.dataset.mobile = 'true';
  } else {
    document.documentElement.dataset.mobile = 'false';
    navStore.toggleOpen(false);
  }
}

onMounted(() => {
  addEventListener('resize', resized);
  resized();
});
</script>
