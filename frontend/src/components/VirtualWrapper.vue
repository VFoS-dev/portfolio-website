<template>
  <div ref="wrapper" class="virtual-wrapper" @scroll="handleScroll">
    <VirtualScroller
      v-if="useVirtualScrolling"
      :items="items"
      :item-height="itemHeight"
      :overscan="overscan"
      :scroll-top="scrollTop"
      :get-item-key="getItemKey"
      @scroll="handleVirtualScroll"
    >
      <template #default="{ item, index }">
        <slot :item="item" :index="index"></slot>
      </template>
    </VirtualScroller>
    <slot v-else></slot>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, nextTick } from 'vue';
import VirtualScroller from './VirtualScroller.vue';

const props = defineProps({
  scrollTop: { type: Number, default: 0 },
  // Virtual scrolling props
  useVirtualScrolling: { type: Boolean, default: false },
  items: { type: Array, default: () => [] },
  itemHeight: { type: Number, default: null },
  overscan: { type: Number, default: 3 },
  getItemKey: { type: Function, default: (item, index) => index },
});

const emit = defineEmits(['scroll']);
const wrapper = ref();
let isRestoringScroll = false;

function handleScroll(event) {
  if (isRestoringScroll || props.useVirtualScrolling) return;
  
  const target = event.target;
  const { scrollTop, scrollHeight } = target;
  const viewportHeight = window.innerHeight || target.clientHeight;
  
  let percent = Math.min(1, scrollTop / (scrollHeight - viewportHeight));
  if (scrollHeight - viewportHeight <= 0) {
    percent = 1;
  }

  emit('scroll', {
    scroll: scrollTop,
    percent,
    mount: false,
  });
}

function handleVirtualScroll({ scroll, percent, mount }) {
  emit('scroll', { scroll, percent, mount });
}

// Watch scrollTop prop and restore scroll position
watch(
  () => props.scrollTop,
  (newScrollTop) => {
    if (wrapper.value && wrapper.value.scrollTop !== newScrollTop) {
      isRestoringScroll = true;
      wrapper.value.scrollTop = newScrollTop;
      nextTick(() => {
        setTimeout(() => {
          isRestoringScroll = false;
        }, 0);
      });
    }
  },
  { immediate: false }
);

onMounted(() => {
  if (props.scrollTop > 0 && wrapper.value && !props.useVirtualScrolling) {
    isRestoringScroll = true;
    wrapper.value.scrollTop = props.scrollTop;
    nextTick(() => {
      setTimeout(() => {
        isRestoringScroll = false;
        handleScroll({ target: wrapper.value });
      }, 0);
    });
  } else if (!props.useVirtualScrolling) {
    setTimeout(() => handleScroll({ target: wrapper.value }), 0);
  }
});
</script>

<style lang="less" scoped>
.virtual-wrapper {
  padding: 4rem;
  padding-top: 141px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100dvw;
  height: 100dvh;
  overflow: hidden; // Changed from auto - VirtualScroller handles scrolling

  &[display] {
    pointer-events: none;
    padding: 0;
    overflow: clip;
  }
  
  // Mobile responsive padding
  @media (max-width: 991px) {
    padding: clamp(1rem, 3vw, 2rem);
    padding-top: clamp(80px, 20vh, 120px);
  }
}
</style>

