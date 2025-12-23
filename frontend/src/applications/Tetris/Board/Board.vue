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
    <div>
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
  background-color: gray;
  display: grid;
  grid-template-columns: repeat(var(--width, 1), 1fr);
  grid-template-rows: repeat(var(--height, 1), 1fr);
  height: calc(var(--size, 30px) * var(--height, 1));
  width: calc(var(--size, 30px) * var(--width, 1));
}
</style>

