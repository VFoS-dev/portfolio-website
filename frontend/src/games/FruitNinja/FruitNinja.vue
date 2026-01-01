<template>
  <canvas ref="canvasRef" :class="{ 'menu-visible': props.showMenu }"></canvas>
  <div v-if="cubeStore.state.socials" class="score-display">
    <div class="score">Score: {{ score }}</div>
    <div class="high-score">High Score: {{ highScore }}</div>
  </div>
  <div v-if="lives > 0" class="lives-display">
    <span v-for="i in lives" :key="i" class="life">❤️</span>
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
const highScore = ref(0);

const STORAGE_KEY = 'fruitNinjaHighScore';

// Load high score from localStorage on mount
function loadHighScore() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    highScore.value = parseInt(saved, 10) || 0;
  }
}

// Save high score to localStorage
function saveHighScore() {
  localStorage.setItem(STORAGE_KEY, highScore.value.toString());
}

function handleLivesUpdate(newLives) {
  lives.value = newLives;
}

function handleScoreUpdate(newScore) {
  score.value = newScore;
  // Update high score if current score is higher
  if (newScore > highScore.value) {
    highScore.value = newScore;
    saveHighScore();
  }
}

function handleGameOver() {
  lives.value = 0;
  game.value?.pause?.();
  // Check if final score is a new high score
  if (score.value > highScore.value) {
    highScore.value = score.value;
    saveHighScore();
  }
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
  loadHighScore();
  if (canvasRef.value) {
    game.value = fruitNinja(true, () => { }, handleLivesUpdate, handleGameOver, handleScoreUpdate);
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
        game.value = fruitNinja(true, () => { }, handleLivesUpdate, handleGameOver, handleScoreUpdate);
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
          loadHighScore(); // Reload high score in case it was updated
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
@font-face {
  font-family: 'go3v2';
  src: url(/fonts/go3v2.ttf);
}

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
  bottom: 20px;
  right: 20px;
  z-index: 10;
  text-align: right;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.score,
.high-score {
  color: #fff;
  font-family: go3v2, sans-serif;
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 0.15rem;
  -webkit-text-stroke: 2px black;
  text-shadow: 
    -1px -1px 0 black,
    1px -1px 0 black,
    -1px 1px 0 black,
    1px 1px 0 black,
    0 0 2px black,
    0 0 4px rgba(0, 0, 0, 0.5),
    2px 2px 4px rgba(0, 0, 0, 0.8),
    3px 3px 6px rgba(0, 0, 0, 0.6);
  paint-order: stroke fill;
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
    font-family: go3v2, sans-serif;
    font-size: 48px;
    font-weight: bold;
    letter-spacing: 0.15rem;
    -webkit-text-stroke: 2px black;
    text-shadow: 
      -1px -1px 0 black,
      1px -1px 0 black,
      -1px 1px 0 black,
      1px 1px 0 black,
      0 0 2px black,
      0 0 4px rgba(0, 0, 0, 0.5),
      3px 3px 6px rgba(0, 0, 0, 0.8),
      4px 4px 8px rgba(0, 0, 0, 0.6);
    paint-order: stroke fill;
    margin-bottom: 1rem;
  }

  .final-score {
    position: fixed;
    bottom: 20px;
    right: 20px;
    font-family: go3v2, sans-serif;
    font-size: 32px;
    letter-spacing: 0.15rem;
    -webkit-text-stroke: 2px black;
    text-shadow: 
      -1px -1px 0 black,
      1px -1px 0 black,
      -1px 1px 0 black,
      1px 1px 0 black,
      0 0 2px black,
      0 0 4px rgba(0, 0, 0, 0.5),
      2px 2px 4px rgba(0, 0, 0, 0.8),
      3px 3px 6px rgba(0, 0, 0, 0.6);
    paint-order: stroke fill;
    text-align: right;
  }
}
</style>
