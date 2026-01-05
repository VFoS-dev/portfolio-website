<template>
  <Wrapper :scroll-top="aboutStore.scroll" @scroll="aboutStore.updateScroll">
    <StringToHTML :key="aboutStore.lastFetched" :string="aboutStore.getContent" />
  </Wrapper>
  <Wrapper display>
    <DuckHunt :active="cubeStore.state.about" />
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
}
</style>
