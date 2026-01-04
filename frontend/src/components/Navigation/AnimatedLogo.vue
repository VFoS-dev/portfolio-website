<template>
  <RouterLink to="/" :style="{ '--frame': frame }"> </RouterLink>
</template>

<script setup>
import { computed } from 'vue';
const props = defineProps({
  scrollPercent: { type: Number, default: 0 },
});

const frame = computed(() => {
  const { scrollPercent } = props;

  return Math.round(scrollPercent * 16);
});
</script>

<style lang="less" scoped>
@keyframes iconAni {
  to {
    background-position-x: 0%;
  }

  from {
    background-position-x: 100%;
  }
}

a {
  aspect-ratio: 1/1;
  background-image: url(/images/nav/logosprite.webp);
  background-position-x: calc(var(--frame, 16) / 16 * 100%);
  background-size: cover;
  background-repeat: no-repeat;
  height: clamp(3rem, 6vw, 4rem);

  &:hover {
    animation: iconAni 1s steps(16) 500ms infinite alternate-reverse;
  }
}

@media (prefers-reduced-motion) {
  a {
    background-position-x: 100% !important;
  }
}
</style>
