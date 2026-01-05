<template>
  <div class="space">
    <Board v-bind="game">
      <template #settings>
        <div class="score-display">
          <div class="score-item">
            <div class="label">Score</div>
            <div class="value">{{ game.score.toLocaleString() }}</div>
          </div>
          <div class="score-item">
            <div class="label">Level</div>
            <div class="value">{{ game.level }}</div>
          </div>
          <div class="score-item">
            <div class="label">Lines</div>
            <div class="value">{{ game.lines }}</div>
          </div>
        </div>
        <div class="controls">
          <button v-if="!playing" @click="playGame">Play</button>
          <button v-else @click="pauseGame">Pause</button>
          <div class="instructions">
            <p>Arrow Keys / WASD: Move</p>
            <p>Up/W: Rotate</p>
            <p>Space: Drop</p>
            <p>C: Hold Piece</p>
          </div>
        </div>
      </template>
    </Board>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref } from 'vue';
import Board from './Board/Board.vue';
import { tetrisSetup } from './tetris';
import { useCubeStore } from '@/stores/cubeStore';

const cubeStore = useCubeStore();

const tetris = ref();
const playing = ref(false);
const game = reactive({
  blocks: [],
  queue: [],
  hold: { item: '', color: '' },
  score: 0,
  level: 1,
  lines: 0,
});


function handleGameEnd() {
  playing.value = false;
  cubeStore.activeGame(false); // Re-enable cube rotation
}

function playGame() {
  playing.value = true;
  cubeStore.activeGame(true); // Disable cube rotation
  if (!tetris.value) {
    tetris.value = tetrisSetup(game, handleGameEnd);
  }
  // Reset score when starting new game
  game.score = 0;
  game.level = 1;
  game.lines = 0;
  tetris.value.play();
  tetris.value.start();
}

function pauseGame() {
  playing.value = false;
  cubeStore.activeGame(false); // Re-enable cube rotation when paused
  tetris.value?.pause?.();
}

onMounted(() => {
  tetris.value = tetrisSetup(game, handleGameEnd);
  // Don't auto-start - wait for user to click Play
});

onBeforeUnmount(() => {
  cubeStore.activeGame(false); // Re-enable cube rotation when app closes
  tetris.value?.unmount?.();
});
</script>

<style scoped lang="less">
@window-bg: #ece9d8;
@inset-depth: 4px;
@highlight: #ffffff;
@shadow: #808080;

.space {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 8px;
  background-color: #c0c0c0;
  box-sizing: border-box;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  
  button {
    padding: 4px 12px;
    background-color: #ece9d8;
    border: @inset-depth outset @highlight;
    border-right-color: @shadow;
    border-bottom-color: @shadow;
    cursor: pointer;
    font-family: 'MS Sans Serif', 'Tahoma', sans-serif;
    font-size: 11px;
    color: #000;
    box-shadow:
      inset 1px 1px 0 0 @shadow,
      inset -1px -1px 0 0 @highlight;
    
    &:active {
      border: @inset-depth inset @highlight;
      border-top-color: @shadow;
      border-left-color: @shadow;
      box-shadow:
        inset -1px -1px 0 0 @shadow,
        inset 1px 1px 0 0 @highlight;
    }
    
    &:hover {
      background-color: #f0eee0;
    }
  }
  
  .instructions {
    font-size: 10px;
    font-family: 'MS Sans Serif', 'Tahoma', sans-serif;
    color: #000;
    padding: 4px;
    background-color: @window-bg;
    border: 1px solid @shadow;
    
    p {
      margin: 0.25rem 0;
      line-height: 1.3;
    }
  }
}

.score-display {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 6px;
  background-color: @window-bg;
  border: @inset-depth inset @highlight;
  border-top-color: @shadow;
  border-left-color: @shadow;
  box-shadow:
    inset 1px 1px 0 0 @shadow,
    inset -1px -1px 0 0 @highlight;
  font-family: 'MS Sans Serif', 'Tahoma', sans-serif;
  
  .score-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 4px;
    
    .label {
      font-size: 10px;
      color: #000;
      font-weight: normal;
    }
    
    .value {
      font-size: 11px;
      color: #000;
      font-weight: bold;
      font-family: 'Courier New', monospace;
      letter-spacing: 0.5px;
    }
  }
}
</style>

