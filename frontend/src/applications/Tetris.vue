<template>
  <div class="space">
    <Board v-bind="game">
      <template #settings>
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
import Board from './Tetris/Board/Board.vue';
import { tetrisSetup } from './Tetris/tetris';
import { cubeStore } from '@/stores/cubeStore';

const tetris = ref();
const playing = ref(false);
const game = reactive({
  blocks: [],
  queue: [],
  hold: { item: '', color: '' },
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
.space {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 1rem;
  background-color: #c0c0c0;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
  
  button {
    padding: 0.5rem 1rem;
    background-color: #ece9d8;
    border: 2px outset #ffffff;
    cursor: pointer;
    font-family: 'MS Sans Serif', 'Tahoma', sans-serif;
    font-size: 11px;
    
    &:active {
      border: 2px inset #ffffff;
    }
  }
  
  .instructions {
    font-size: 10px;
    font-family: 'MS Sans Serif', 'Tahoma', sans-serif;
    color: #000;
    margin-top: 0.5rem;
    
    p {
      margin: 0.25rem 0;
    }
  }
}
</style>

