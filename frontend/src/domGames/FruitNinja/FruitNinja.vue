<template>
  <canvas ref="canvasRef"></canvas>
  <div v-if="lives > 0" class="lives-display">
    <span v-for="i in lives" :key="i" class="life">❤️</span>
  </div>
  <div v-else class="game-over">
    <h2>Game Over!</h2>
  </div>
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
const lives = ref(3);

function handleLivesUpdate(newLives) {
  lives.value = newLives;
}

function handleGameOver() {
  lives.value = 0;
  game.value?.pause?.();
}

onMounted(() => {
  if (canvasRef.value) {
    game.value = fruitNinja(true, () => {}, handleLivesUpdate, handleGameOver);
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
        game.value = fruitNinja(true, () => {}, handleLivesUpdate, handleGameOver);
        game.value.setup(canvasRef.value);
        game.value.gameStart();
        cubeStore.activeGame(true);
        if (state) {
          game.value.unpause?.();
        }
      } else if (game.value) {
        if (state && lives.value > 0) {
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

.lives-display {
  position: fixed;
  top: 20px;
  left: 20px;
  z-index: 10;
  display: flex;
  gap: 10px;
  font-size: 24px;
}

.life {
  display: inline-block;
}

.game-over {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 10;
  text-align: center;
  color: #fff;
  font-size: 48px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  pointer-events: none;
}
</style>

