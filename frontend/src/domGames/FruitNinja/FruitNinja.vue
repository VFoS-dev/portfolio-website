<template>
  <canvas ref="canvasRef"></canvas>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { fruitNinja } from './fruitNinja';
import { cubeStore } from '@/stores/cubeStore';

const canvasRef = ref(null);
const props = defineProps({
  active: { type: Boolean, default: false },
});
const game = ref();

onMounted(() => {
  if (canvasRef.value) {
    game.value = fruitNinja(true, () => {});
    game.value.setup(canvasRef.value);
    game.value.gameStart();
    cubeStore.activeGame(true);
    if (props.active) {
      game.value.unpause?.();
    }
  }
});

watch(
  () => props.active,
  state => {
    setTimeout(() => {
      if (!game.value && canvasRef.value) {
        game.value = fruitNinja(true, () => {});
        game.value.setup(canvasRef.value);
        game.value.gameStart();
        cubeStore.activeGame(true);
        if (state) {
          game.value.unpause?.();
        }
      } else if (game.value) {
        if (state) {
          game.value.unpause?.();
        } else {
          game.value.pause?.();
        }
      }
    }, 0);
  }
);

onBeforeUnmount(() => {
  if (game.value) {
    game.value.dismount();
    game.value.gameEnd();
    cubeStore.activeGame(false);
  }
});
</script>

<style lang="less" scoped>
canvas {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: auto;
  cursor: crosshair;
}
</style>

