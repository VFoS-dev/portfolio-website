<template>
  <div class="space">
    <Board v-bind="game">
      <slot v-if="!playing"></slot>
      <template #settings>
        <button @click="playGame">play</button>
      </template>
    </Board>
  </div>
</template>

<script setup>
import { onBeforeUnmount, onMounted, reactive, ref, watch } from 'vue';
import Board from './Board/Board.vue';
import { tetrisSetup } from './tetris';

const props = defineProps({
  active: { type: Boolean, default: false },
});

const tetris = ref();
const playing = ref(false);
const game = reactive({
  blocks: [{ x: 0, y: 10, color: 'grey' }],
  queue: [],
  hold: {},
});

function playGame() {
  playing.value = true;
  tetris.value.play();
}

watch(
  () => props.active,
  state => {
    setTimeout(() => {
      if (!tetris.value) tetris.value = tetrisSetup(game);
      if (state) tetris.value.unpause?.();
      else tetris.value.pause?.();
    }, 0);
  }
);

onMounted(() => {
  tetris.value = tetrisSetup(game);
});

onBeforeUnmount(() => {
  tetris.value.unmount?.();
});
</script>

<style scoped lang="less">
.space {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
}
</style>
