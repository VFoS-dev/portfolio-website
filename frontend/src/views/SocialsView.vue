<template>
  <canvas id="slash" class="sticky-overlay" ref="canvasRef"></canvas>
  <FruitNinja v-if="gameStarted" :active="cubeStore.state.socials && gameStarted" />
  <div class="socials" :class="{ hidden: gameStarted }">
    <div class="navpadding"></div>
    <div :class="['links', { toGame: toGame }]" @animationend="handleAnimationEnd">
      <div
        v-for="(item, index) in socialsData"
        :key="`option-${item.name}`"
        class="option"
        :style="{ backgroundImage: `url(${item.shadow})` }"
      >
        <div class="option-group">
          <div class="circle" :style="{ '--rot': `${item.startRot}deg` }">
            <svg class="text" viewBox="0 0 168 168" xmlns="http://www.w3.org/2000/svg">
              <path
                id="upper"
                fill="none"
                transform="translate(19.7999976778584, 84) scale(1,-1)"
                d="M0 -1.26218e-29C-3.33663e-14 22.9365 12.2365 44.1306 32.1 55.5988C51.9636 67.0671 76.4365 67.0671 96.3 55.5988C116.164 44.1306 128.4 22.9365 128.4 1.09118e-13"
              />
              <path
                id="lower"
                fill="none"
                transform="matrix(-0.999980871067792 0.00618381781983816 -0.00618381781983816 -0.999980871067792 148.19877424465 83.6029988816068)  scale(1,-1)"
                d="M0 1.77501e-13C1.05879e-13 35.4567 28.7433 64.2 64.2 64.2C99.6567 64.2 128.4 35.4567 128.4 2.29597e-13"
              />
              <text class="fnFont" alignment-baseline="top">
                <textPath href="#upper" :fill="item.upper.fill" :stroke="item.upper.stroke">
                  {{ item.name }}
                </textPath>
                <textPath href="#lower" :fill="item.lower.fill" :stroke="item.lower.stroke">
                  {{ item.name }}
                </textPath>
              </text>
            </svg>
            <img class="decor" :src="item.ring" />
          </div>
          <img
            class="gif"
            :src="item.gif"
            :id="index"
            @click="openLink(index)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
import FruitNinja from '@/domGames/FruitNinja/FruitNinja.vue';
import { setupSlashEffect } from '@/domGames/FruitNinja/slashEffect';
import { cubeStore } from '@/stores/cubeStore';
import socialsDataRaw from '@/json/socialsData.json';

const canvasRef = ref(null);
const toGame = ref(false);
const gameStarted = ref(false);
let slashEffect = null;

// Generate random rotations for each social item
const socialsData = computed(() => {
  return socialsDataRaw.map((item) => ({
    ...item,
    startRot: Math.random() * 360,
  }));
});

function openLink(index) {
  const item = socialsData.value[index];
  if (item.href === 'game-start') {
    toGame.value = true;
  } else {
    window.open(item.href, '_blank');
  }
}

function handleAnimationEnd() {
  if (toGame.value) {
    gameStarted.value = true;
  }
}

onMounted(() => {
  if (canvasRef.value) {
    slashEffect = setupSlashEffect(canvasRef.value);
  }
});

onBeforeUnmount(() => {
  if (slashEffect) {
    slashEffect.stop();
  }
});

</script>

<style lang="less" scoped>
@font-face {
  font-family: 'go3v2';
  src: url(/fonts/go3v2.ttf);
}

.socials {
  cursor: none;
  padding: 0px !important;
  background-color: rgb(124, 72, 61);
  background-image: url(/images/socials/game/woodplankbackground.webp);
  background-repeat: repeat;
  background-position: 50%;
  background-blend-mode: multiply;
  min-height: 100vh;
  width: 100%;
}

.fnFont {
  fill: white;
  stroke: black;
  font-family: go3v2, sans-serif;
  letter-spacing: 0.15rem;
}

.socials.hidden {
  display: none;
}

.sticky-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 1;
  pointer-events: none;
  cursor: crosshair;
}

.sticky-overlay:hover {
  cursor: crosshair;
}

@keyframes rotSVG {
  from {
    rotate: calc(var(--rot, 0deg) + 360deg);
  }
  to {
    rotate: calc(var(--rot, 0deg) + 0deg);
  }
}

.links {
  overflow: hidden;
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  gap: 5%;
  padding: 2rem;
}

.option {
  --size: min(25vmax, 44vh, 44vw);
  width: var(--size);
  height: var(--size);
  transform: translate(-2%, 7.5%);
}

.option-group {
  overflow: hidden;
  transform: translate(2%, -7.5%);
  position: relative;
  width: var(--size);
  height: var(--size);
}

.option-group .circle .text {
  z-index: 1;
}

.option-group .circle > * {
  pointer-events: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  transform-origin: center;
}

.option-group .circle {
  pointer-events: none;
  transform-origin: center;
  position: absolute;
  animation: rotSVG 20s forwards infinite linear;
  width: 100%;
  top: 50%;
  scale: 1.5;
}

.option-group .gif {
  cursor: pointer;
  position: absolute;
  width: 50%;
  height: 50%;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
}

.links.toGame {
  animation: disappear 0.125s linear forwards;
}

@keyframes disappear {
  from {
    opacity: 1;
    pointer-events: none;
  }
  to {
    opacity: 0;
    display: none;
    pointer-events: none;
  }
}

.navpadding {
  height: 80px;
}
</style>
