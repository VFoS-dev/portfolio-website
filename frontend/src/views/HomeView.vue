<template>
  <Canvas ref="canvasRef" :game-state="gameState" />
  <div class="welcome" :class="{ hide: playingGame }">
    <h2>Hello</h2>
    <h1>I'm <span>Jon Kido</span></h1>
    <h3>Full Stack and Game Developer</h3>
    <div class="button-group">
      <StyledButton class="orange" @click="playSnake"> Play Snake </StyledButton>
      <StyledButton v-if="false" class="blue"> Play Muliplayer </StyledButton>
      <StyledButton @click="toResume"> View Resume </StyledButton>
    </div>
  </div>
</template>

<script setup>
import { snakeGameSetup } from '@/games/Snake/snake';
import Canvas from '@/components/Canvas.vue';
import StyledButton from '@/components/Buttons/StyledButton.vue';
import router from '@/router';
import { cubeStore } from '@/stores/cubeStore';
import { navStore } from '@/stores/navStore';
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const game = ref({});
const canvasRef = ref();
const toResume = () => router.push({ name: 'resume' });
const playingGame = ref(false);
const gameState = computed(() => {
  const state = cubeStore.state.home;
  if (state) {
    game.value.unpause?.();
    // Start AI when home view is in focus and player is not playing
    if (!playingGame.value) {
      game.value.startAI?.();
    }
  } else {
    game.value.pause?.();
  }
  return state;
});

onMounted(() => {
  game.value = snakeGameSetup(canvasRef.value.canvas, gameEnded);
  // Start AI when component mounts if home is in focus
  if (cubeStore.state.home) {
    setTimeout(() => {
      game.value.startAI?.();
    }, 500);
  }
});

onBeforeUnmount(() => {
  game.value.unmount?.();
});

function playSnake() {
  // Clear AI and start player game
  game.value.gameStart();
  navStore.activeGame(true);
  cubeStore.activeGame(true);
  playingGame.value = true;
}

function gameEnded() {
  navStore.activeGame(false);
  cubeStore.activeGame(false);
  playingGame.value = false;
}
</script>

<style lang="less" scoped>
.welcome {
  align-items: flex-start;
  color: #fff;
  display: inline-flex;
  flex-direction: column;
  font-family: Handjet;
  font-style: normal;
  gap: clamp(5px, 3vh, 30px);
  left: 10%;
  position: absolute;
  top: 53%;
  transform: translateY(-50%);
  transition: opacity var(--hide-duration);

  &.hide {
    opacity: 0;
    pointer-events: none;
  }
}

.button-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2rem;
}

h1,
h2,
h3,
span {
  font-family: Handjet;
  font-size: var(--font-size);
  font-weight: bold;
  line-height: var(--font-size);
}

h1 {
  --font-size: clamp(30px, 15vh, 120px);

  span {
    background: linear-gradient(180deg, #f5bf00, #ed4b05);
    background-clip: text;

    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
  }
}

h2 {
  --font-size: clamp(10px, 5vh, 40px);

  &::after {
    content: '';
    aspect-ratio: 1 / 1;
    background-image: url(/images/intro/wave.webp);
    background-repeat: no-repeat;
    background-position: 50%;
    background-size: cover;
    display: inline-block;
    height: var(--font-size);
    scale: 1.4;
    transform-origin: left center;
    margin-left: 1.5rem;
    top: 50%;
  }
}

h3 {
  color: #f32222;
  --font-size: clamp(14px, 7vh, 56px);
}
</style>
