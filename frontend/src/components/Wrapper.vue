<template>
  <div ref="wrapper" class="wrap" @scroll="handleScroll">
    <slot></slot>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue';

const props = defineProps({
  scrollTop: { type: Number, default: 0 },
});
const emit = defineEmits(['scroll']);
const wrapper = ref();

function handleScroll({ target: { scrollTop, scrollHeight } }, mount = false) {
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

onMounted(() => setTimeout(() => handleScroll({ target: wrapper.value }, true), 0));
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
}
</style>
