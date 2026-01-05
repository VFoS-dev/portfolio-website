<template>
  <div
    :type="props.type"
    :alive="props.alive"
    :class="classes"
    :style="style"
    @animationend="removeDuck"
    @pointerdown="hitDuck"
  >
    <Teleport v-if="props.score" to="[birds]">
      <span class="score" :style="style">{{ props.score }}</span>
    </Teleport>
  </div>
</template>

<script setup>
import { computed } from 'vue';
const emit = defineEmits(['removeDuck', 'hitDuck']);

const props = defineProps({
  id: [String, Number],
  type: { type: String, default: 'blue' },
  alive: { type: Boolean, default: true },
  score: [String, Number],
  direction: { type: Object, default: () => ({ x: 1, y: 0 }) },
  position: { type: Object, default: () => ({ top: 50, left: 50 }) },
});

const classes = computed(() => {
  const sign = v => (v < 0 ? '-' : '');

  const dir = [];
  const { x, y } = props.direction;

  if (x) dir.push(`${sign(x)}x`);
  if (y) dir.push(`${sign(y)}y`);

  return dir;
});

const style = computed(() => {
  const { top, left } = props.position;
  return {
    top: `${top}px`,
    left: `${left}px`,
  };
});

const hitDuck = () => emit('hitDuck', props.id);
const removeDuck = ({ animationName }) =>
  animationName === 'duckFalling' && emit('removeDuck', props.id);
</script>

<style scoped lang="less">
div {
  --size: 100;
  width: calc(var(--size) * 1px);
  height: calc(var(--size) * 1px);
  pointer-events: all;
  cursor: pointer;
  position: absolute;
  
  // Mobile responsive scaling
  @media (max-width: 991px) {
    scale: 0.6;
  }

  /* default blue bird */
  --y-start: -120px;
  --y-end: -120px;
  --x-start: 0px;
  --x-end: -121px;

  &[type='blue'] {
    --x-start: 0px;
    --x-end: -121px;
  }

  &[type='green'] {
    --x-start: -130px;
    --x-end: -251.66px;
  }

  &[type='brown'] {
    --x-start: -260px;
    --x-end: -380px;
  }

  &::before {
    --scale: calc(var(--size) / 35);
    scale: var(--scale);
    transform-origin: top left;
    content: '';
    position: absolute;
    width: 35px;
    height: 35px;
    background: url(/images/about/sprite_sheet.webp);
  }

  /* flying left */
  &.-x {
    transform: scaleX(-1);
  }

  &[alive='true'] {
    &:hover::after {
      pointer-events: none;
      content: '';
      position: absolute;
      height: 100%;
      width: 100%;
      background: url(/images/about/crosshair.svg);
    }

    &::before {
      animation: spriteLoop 0.5s steps(3) infinite;
    }

    /* flying diagonally */
    &:is(.-y, .y):is(.x, .-x) {
      --y-start: -155px;
      --y-end: -155px;

      &.-y {
        rotate: calc(var(--dir, 1) * 90deg);
      }

      &.-x {
        --dir: -1;
      }
    }

    /* flying vertically */
    &:not(.-x, .x) {
      &:is(.-y, .y) {
        --y-start: -195px;
        --y-end: -195px;
      }

      /* flying down */
      &.-y {
        transform: scaleY(-1);
      }
    }
  }

  &[alive='false'] {
    pointer-events: none;
    cursor: auto;
    animation: duckDeath 200ms steps(1) 0.7s infinite;
    --y-start: -232px;
    --y-end: -232px;
    --x-middle: var(--x-start);

    &::before {
      animation: duckFalling 4s linear 0.7s forwards;
      background-position-y: var(--y-start);
      background-position-x: var(--x-middle);
    }
  }
}

span.score {
  position: absolute;
  animation: duckScore 0.25s 3s forwards;
  text-shadow:
    2px 2px black,
    -1px -1px black;
  color: #fff;
  font-family: VT323, latin;
  font-size: 2rem;
  z-index: -1;
  transform: translate(calc(50px - 50%), calc(50px - 50%));
  
  // Mobile responsive scaling
  @media (max-width: 991px) {
    font-size: clamp(1rem, 4vw, 1.5rem);
    transform: translate(calc(clamp(25px, 6vw, 37px) - 50%), calc(clamp(25px, 6vw, 37px) - 50%));
  }
}
</style>

<style>
@keyframes duckDeath {
  0% {
    transform: scaleX(1);
  }

  50% {
    transform: scaleX(-1);
  }

  100% {
    transform: scaleX(1);
  }
} 

@keyframes duckFalling {
  from {
    --x-middle: calc(var(--x-start) - 39px);
  }

  to {
    transform: translateY(100vh);
  }
}

@keyframes duckScore {
  from {
    opacity: 1;
  }

  to {
    opacity: 0;
  }
}
</style>
