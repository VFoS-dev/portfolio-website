<template>
  <Canvas ref="canvasRef" :state="starFieldState"></Canvas>
  <VirtualWrapper
    :scroll-top="skillStore.scroll"
    @scroll="skillStore.updateScroll"
    :use-virtual-scrolling="true"
    :items="skillGroups"
    :item-height="null"
    :overscan="2"
    :get-item-key="(item) => item.name"
  >
    <template #default="{ item }">
      <SkillGroup
        :header="item.name"
        :skills="item.skills"
        :get-colors="skillStore.randomColor"
      ></SkillGroup>
    </template>
  </VirtualWrapper>
</template>

<script setup>
import { setupStarField } from '@/canvas/StarField/starfield';
import Canvas from '@/components/Canvas.vue';
import SkillGroup from '@/components/SkillGroup.vue';
import { useCubeStore } from '@/stores/cubeStore';

const cubeStore = useCubeStore();
import { computed, onMounted, ref, onBeforeUnmount } from 'vue';
import { useSkillStore } from '@/stores/skillStore';

const skillStore = useSkillStore();
import VirtualWrapper from '@/components/VirtualWrapper.vue';

// Convert skills object to array for virtual scrolling
const skillGroups = computed(() => {
  const skills = skillStore.getSkills;
  return Object.entries(skills).map(([name, value]) => ({
    name,
    skills: value,
  }));
});

const canvasRef = ref();
const starField = ref({});

const starFieldState = computed(() => {
  const state = cubeStore.state.skills;
  if (state) starField.value.unpause?.();
  else starField.value.pause?.();
  return state;
});

onMounted(() => {
  starField.value = setupStarField(canvasRef.value.canvas);
});

onBeforeUnmount(() => {
  starField.value.unmount?.();
});
</script>

<style lang="less" scoped>
.wrap {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 7rem;

  & > * {
    flex-grow: 1;
    flex-basis: 700px;
    max-width: min(100%, 900px);
  }
  
  // Mobile responsive adjustments
  @media (max-width: 991px) {
    gap: clamp(2rem, 5vw, 4rem);
    
    & > * {
      flex-basis: min(100%, 500px);
      max-width: 100%;
    }
  }
  
  @media (max-width: 480px) {
    gap: clamp(1.5rem, 4vw, 2.5rem);
    
    & > * {
      flex-basis: 100%;
    }
  }
}
</style>
