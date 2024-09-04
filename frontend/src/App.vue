<template>
  <NavBar />
  <CubeRouter />
</template>

<script setup>
import CubeRouter from '@/components/CubeRouter.vue';
import NavBar from '@/components/Navigation/NavBar.vue';
import { onMounted, provide, ref } from "vue";
import provideInject from './enums/provideInject';
import { navStore } from './stores/navStore';

const isMobile = ref(false);
const isPortrait = ref(false);

provide(provideInject.isMobile, isMobile);
provide(provideInject.isPortrait, isPortrait);

function resized() {
  if (isPortrait.value = window.innerWidth < window.innerHeight) {
    document.documentElement.dataset.rotation = 'portrait';
  } else {
    document.documentElement.dataset.rotation = 'landscape';
  }

  if (isMobile.value = window.innerWidth < 991) {
    document.documentElement.dataset.mobile = 'true';
  } else {
    document.documentElement.dataset.mobile = 'false';
    navStore.toggleOpen(false);
  }
}

onMounted(() => {
  addEventListener('resize', resized);
  resized();
})
</script>