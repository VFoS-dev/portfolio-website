<template>
  <VirtualWrapper
    :scroll-top="aboutStore.scroll"
    @scroll="aboutStore.updateScroll"
    :use-virtual-scrolling="true"
    :items="paragraphs"
    :item-height="null"
    :overscan="3"
    :get-item-key="(item, index) => `para-${index}-${item.str.substring(0, 10)}`"
  >
    <template #default="{ item }">
      <p v-bind="item.attr">{{ item.str }}</p>
    </template>
  </VirtualWrapper>
  <Wrapper display>
    <DuckHunt :active="cubeStore.state.about"></DuckHunt>
  </Wrapper>
</template>

<script setup>
import { useAboutStore } from '@/stores/aboutStore';

const aboutStore = useAboutStore();
import { computed } from 'vue';
import VirtualWrapper from '@/components/VirtualWrapper.vue';
import Wrapper from '@/components/Wrapper.vue';
import DuckHunt from '@/games/DuckHunt/DuckHunt.vue';
import { useCubeStore } from '@/stores/cubeStore';

const cubeStore = useCubeStore();

// Parse content into paragraphs for virtual scrolling
const paragraphs = computed(() => {
  const content = aboutStore.getContent;
  if (!content) return [];
  
  return content.split('\n').map(s => {
    let attr = {};
    const [str, hasId] = s.split(/#.+$/);
    if (hasId !== undefined) attr.id = s.split(str)[1]?.substring(1);

    // Check for tab (original format) or lines starting with two spaces (new format)
    const [, hasTab] = str.split(/^\t/);
    const hasIndent = str.startsWith('  ');
    if (hasTab || hasIndent) attr.class = 'tab';

    return { str, attr };
  });
});
</script>

<style lang="less" scoped>
// Apply padding to virtual wrapper content
:deep(.virtual-content) {
  padding-left: 15vw;
  padding-right: 15vw;
  padding-bottom: 90px;
  padding-top: 1rem;
  
  // Mobile responsive padding
  @media (max-width: 991px) {
    padding-left: clamp(1rem, 4vw, 2rem);
    padding-right: clamp(1rem, 4vw, 2rem);
    padding-bottom: clamp(6rem, 12vh, 8rem);
    padding-top: 0.5rem;
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
