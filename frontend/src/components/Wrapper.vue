<template>
  <div ref="wrapper" class="wrap" @scroll="handleScroll">
    <slot></slot>
  </div>
</template>

<script setup>
import { onMounted, ref, watch, nextTick } from 'vue';

const props = defineProps({
  scrollTop: { type: Number, default: 0 },
});
const emit = defineEmits(['scroll']);
const wrapper = ref();
let isRestoringScroll = false;

function handleScroll({ target: { scrollTop, scrollHeight } }, mount = false) {
  // Don't emit scroll events while we're restoring scroll position
  if (isRestoringScroll) return;
  
  let percent = Math.min(1, scrollTop / (scrollHeight - innerHeight));
  if (scrollHeight - innerHeight <= 0) {
    percent = 1;
  }

  emit('scroll', {
    scroll: scrollTop,
    percent,
    mount,
  });
}

// Watch scrollTop prop and restore scroll position
watch(
  () => props.scrollTop,
  (newScrollTop) => {
    if (wrapper.value && wrapper.value.scrollTop !== newScrollTop) {
      isRestoringScroll = true;
      wrapper.value.scrollTop = newScrollTop;
      // Reset flag after a brief delay to allow scroll to settle
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
  // Restore scroll position if provided
  if (props.scrollTop > 0 && wrapper.value) {
    isRestoringScroll = true;
    wrapper.value.scrollTop = props.scrollTop;
    nextTick(() => {
      setTimeout(() => {
        isRestoringScroll = false;
        handleScroll({ target: wrapper.value }, true);
      }, 0);
    });
  } else {
    setTimeout(() => handleScroll({ target: wrapper.value }, true), 0);
  }
});
</script>

<style lang="less" scoped>
.wrap {
  padding: 4rem;
  padding-top: 141px;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100dvw;
  height: 100dvh;
  overflow: auto;

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
