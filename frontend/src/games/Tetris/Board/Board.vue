<template>
  <div class="game">
    <Hold v-bind="props.hold" style="--size: 20px" />
    <div class="board">
      <slot>
        <Block
          v-for="{ x, y, color } of blocks"
          :style="{ gridArea: `${y + 1} / ${x + 1}`, '--color': color }"
        />
      </slot>
    </div>
    <div class="sidebar">
      <Queue :items="props.queue" style="--size: 20px" />
      <slot name="settings"> </slot>
    </div>
  </div>
</template>

<script setup>
import Block from '../Pieces/Block.vue';
import Hold from './Hold.vue';
import Queue from './Queue.vue';

const props = defineProps({
  blocks: { type: Array, default: [] },
  queue: { type: Array, default: [] },
  hold: { type: String, default: '' },
});
</script>

<style lang="less" scoped>
@window-bg: #ece9d8;
@inset-depth: 4px;
@highlight: #ffffff;
@shadow: #808080;

.game {
  display: flex;
  flex-direction: row;
  gap: 0.5rem;
  align-items: flex-start;
}

.board {
  --color: green;
  --width: 10;
  --height: 24;
  --grid-dark: #1a1a1a;
  --grid-light: #2a2a2a;
  
  background-color: #000000;
  background-image: 
    repeating-linear-gradient(
      0deg,
      transparent,
      transparent calc(100% / var(--height) - 1px),
      var(--grid-light) calc(100% / var(--height) - 1px),
      var(--grid-light) calc(100% / var(--height))
    ),
    repeating-linear-gradient(
      90deg,
      transparent,
      transparent calc(100% / var(--width) - 1px),
      var(--grid-light) calc(100% / var(--width) - 1px),
      var(--grid-light) calc(100% / var(--width))
    );
  
  display: grid;
  grid-template-columns: repeat(var(--width, 1), 1fr);
  grid-template-rows: repeat(var(--height, 1), 1fr);
  height: calc(var(--size, 30px) * var(--height, 1));
  width: calc(var(--size, 30px) * var(--width, 1));
  
  border: @inset-depth inset @highlight;
  border-top-color: @shadow;
  border-left-color: @shadow;
  box-shadow: 
    inset 1px 1px 0 0 @shadow,
    inset -1px -1px 0 0 @highlight;
  padding: 2px;
}

.sidebar {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  width: 100px;
}
</style>

