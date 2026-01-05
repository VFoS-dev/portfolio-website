<template>
  <canvas ref="canvas"></canvas>
</template>

<script setup>
import { ref } from 'vue';

const canvas = ref();

defineExpose({ canvas });
</script>

<style lang="less" scoped>
canvas {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 0;
}
</style>
