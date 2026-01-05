<template>
  <Wrapper :scroll-top="aboutStore.scroll" @scroll="aboutStore.updateScroll">
    <StringToHTML :key="aboutStore.lastFetched" :string="aboutStore.getContent"></StringToHTML>
  </Wrapper>
  <Wrapper display>
    <DuckHunt :active="cubeStore.state.about"></DuckHunt>
  </Wrapper>
</template>

<script setup>
import { useAboutStore } from '@/stores/aboutStore';

const aboutStore = useAboutStore();
import StringToHTML from '@/components/StringToHTML.vue';
import Wrapper from '@/components/Wrapper.vue';
import DuckHunt from '@/games/DuckHunt/DuckHunt.vue';
import { useCubeStore } from '@/stores/cubeStore';

const cubeStore = useCubeStore();
</script>

<style lang="less" scoped>
.wrap {
  padding-left: 15vw;
  padding-right: 15vw;
  padding-bottom: 90px;
  
  // Mobile responsive padding
  @media (max-width: 991px) {
    padding-left: clamp(1rem, 4vw, 2rem);
    padding-right: clamp(1rem, 4vw, 2rem);
    padding-bottom: clamp(6rem, 12vh, 8rem);
  }
}

:deep(p) {
  margin-bottom: 1rem;
  margin-top: 0;
  color: #fff;
  font-family: VT323, latin;
  font-size: 2.5rem;
  pointer-events: none;
  text-shadow:
    2px 2px 1px grey,
    -1px -1px grey;

  &.tab {
    text-indent: calc(3rem + 1rem * var(--tabAmount, 0));
  }

  &[id] {
    margin-top: 4rem;
  }
  
  // Mobile responsive font sizing
  @media (max-width: 991px) {
    font-size: clamp(1.25rem, 5vw, 2rem);
    margin-bottom: clamp(0.5rem, 2vh, 1rem);
    line-height: 1.4;
    
    &.tab {
      text-indent: calc(clamp(1.5rem, 4vw, 2rem) + clamp(0.5rem, 1.5vw, 1rem) * var(--tabAmount, 0));
    }
    
    &[id] {
      margin-top: clamp(2rem, 5vh, 3rem);
    }
  }
}
</style>
