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
import { useCubeStore } from '@/stores/cubeStore';

const cubeStore = useCubeStore();
import { useNavStore } from '@/stores/navStore';

const navStore = useNavStore();
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const game = ref({});
const canvasRef = ref();
const toResume = () => router.push({ name: 'resume' });
const playingGame = ref(false);
const gameState = computed(() => {
  const state = cubeStore.state.home;
  if (state) {
    game.value.unpause?.();
    // unpause() will handle resuming AI if it was already playing
    // Only start AI if game hasn't been initialized yet (handled by unpause)
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
  width: calc(100% - 20%);
  max-width: 90%;
  padding: 0 1rem;
  box-sizing: border-box;
  backface-visibility: visible;
  -webkit-backface-visibility: visible;
  will-change: transform, opacity;

  &.hide {
    opacity: 0;
    pointer-events: none;
  }

  // Mobile styles
  @media (max-width: 991px) {
    left: 5%;
    width: 90%;
    padding: 0 1.5rem;
  }

  @media (max-width: 480px) {
    left: 2.5%;
    width: 95%;
    padding: 0 1rem;
    gap: clamp(3px, 2vh, 20px);
  }
}

.button-group {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  gap: 2rem;
  width: 100%;
  justify-content: flex-start;

  @media (max-width: 991px) {
    gap: 1.5rem;
  }

  @media (max-width: 480px) {
    flex-direction: column;
    gap: 1rem;
    width: auto;
  }
}

h1,
h2,
h3,
span {
  font-family: Handjet;
  font-size: var(--font-size);
  font-weight: bold;
  line-height: var(--font-size);
  backface-visibility: visible;
  -webkit-backface-visibility: visible;
}

h1 {
  --font-size: clamp(30px, 15vh, 120px);

  @media (max-width: 991px) {
    --font-size: clamp(24px, 12vh, 80px);
  }

  @media (max-width: 480px) {
    --font-size: clamp(20px, 10vh, 60px);
  }

  span {
    background: linear-gradient(180deg, #f5bf00, #ed4b05);
    background-clip: text;

    -webkit-text-fill-color: transparent;
    -webkit-background-clip: text;
  }
}

h2 {
  --font-size: clamp(10px, 5vh, 40px);

  @media (max-width: 991px) {
    --font-size: clamp(8px, 4vh, 32px);
  }

  @media (max-width: 480px) {
    --font-size: clamp(7px, 3.5vh, 28px);
  }

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

    @media (max-width: 991px) {
      scale: 1.2;
      margin-left: 1rem;
    }

    @media (max-width: 480px) {
      scale: 1;
      margin-left: 0.5rem;
    }
  }
}

h3 {
  color: #f32222;
  --font-size: clamp(14px, 7vh, 56px);

  @media (max-width: 991px) {
    --font-size: clamp(12px, 6vh, 48px);
  }

  @media (max-width: 480px) {
    --font-size: clamp(10px, 5vh, 40px);
  }
}
</style>
