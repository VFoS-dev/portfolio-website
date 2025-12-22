<template>
  <canvas ref="canvasRef" :class="{ 'menu-visible': props.showMenu }"></canvas>
  <div v-if="lives > 0" class="score-display">
    <div class="score">Score: {{ score }}</div>
  </div>
  <div v-if="lives > 0" class="lives-display">
    <span v-for="i in lives" :key="i" class="life">❤️</span>
  </div>
  <div v-if="lives <= 0" class="game-over">
    <h2>Game Over!</h2>
    <div class="final-score">Final Score: {{ score }}</div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch } from 'vue';
import { fruitNinja } from './fruitNinja';
import { cubeStore } from '@/stores/cubeStore';

const canvasRef = ref(null);
const props = defineProps({
  active: { type: Boolean, default: false },
  onGameOver: { type: Function, default: null },
  showMenu: { type: Boolean, default: false },
});
const game = ref();
const lives = ref(3);
const score = ref(0);

function handleLivesUpdate(newLives) {
  lives.value = newLives;
}

function handleScoreUpdate(newScore) {
  score.value = newScore;
}

function handleGameOver() {
  lives.value = 0;
  game.value?.pause?.();
  cubeStore.activeGame(false); // Re-enable WASD when game ends
  // Notify parent to show menu
  if (props.onGameOver) {
    props.onGameOver();
  }
}

function handleKeyPress(e) {
  // Only handle Escape when game is active
  if (e.key === 'Escape' && props.active && lives.value > 0) {
    e.preventDefault();
    // Return to menu
    if (props.onGameOver) {
      props.onGameOver();
    }
  }
  // Don't prevent default for other keys - let WASD and other keys work normally when game is not active
}

onMounted(() => {
  if (canvasRef.value) {
    game.value = fruitNinja(true, () => {}, handleLivesUpdate, handleGameOver, handleScoreUpdate);
    game.value.setup(canvasRef.value);
    game.value.gameStart();
    cubeStore.activeGame(true);
    if (props.active) {
      game.value.unpause?.();
    }
  }
  window.addEventListener('keydown', handleKeyPress);
});

watch(
  () => props.active,
  state => {
    setTimeout(() => {
      if (!game.value && canvasRef.value) {
        game.value = fruitNinja(true, () => {}, handleLivesUpdate, handleGameOver, handleScoreUpdate);
        game.value.setup(canvasRef.value);
        game.value.gameStart();
        cubeStore.activeGame(true);
        if (state) {
          game.value.unpause?.();
        }
      } else if (game.value) {
        // If game was frozen and we're restarting, reset it
        if (game.value.isFrozen?.() && state) {
          game.value.gameStart();
          lives.value = 3;
          score.value = 0;
        }
        if (state && lives.value > 0) {
          game.value.unpause?.();
          cubeStore.activeGame(true);
        } else {
          game.value.pause?.();
          cubeStore.activeGame(false);
        }
      }
    }, 0);
  }
);

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyPress);
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
  cursor: crosshair;
}

canvas.menu-visible {
  pointer-events: none;
}

.score-display {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  text-align: center;
}

.score {
  color: #fff;
  font-size: 32px;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.lives-display {
  position: fixed;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
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
  pointer-events: none;

  h2 {
    font-size: 48px;
    font-weight: bold;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
    margin-bottom: 1rem;
  }

  .final-score {
    font-size: 32px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  }
}

</style>

