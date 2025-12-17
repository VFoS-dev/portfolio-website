<template>
  <div :class="classes">
    <span></span>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  state: { type: Number, default: -1 },
});

const classes = computed(
  () =>
    ({
      1: 'correct',
      0: 'incorrect',
    })[+props.state]
);
</script>

<style scoped lang="less">
div {
  --border: 2px solid hsla(0, 0%, 69%, 0.2);

  height: 30px;
  width: 30px;
  position: relative;

  display: flex;
  align-items: center;
  justify-content: center;

  &.correct {
    --background-color: #dafdda;
    --border: 2px solid #09ff00;
    --box-shadow:
      0 0 5px #fff, 0 0 12px #fff, 0 0 15px #009614, 0 0 35px #2ec936, inset 0 0 11px #0f5;
  }

  &.incorrect {
    --background-color: red;
    --border: 2px solid #f32222;
    --box-shadow:
      0 0 5px #ec6868, 0 0 12px #e69090, 0 0 15px #960000, 0 0 35px #f01c1c, inset 0 0 11px #ee5e5e;
    cursor: pointer;
    pointer-events: all;

    &:hover {
      opacity: 0.5;
    }
  }

  span {
    border: var(--border);
    box-shadow: var(--box-shadow);
    background-color: var(--background-color);

    border-radius: 100%;
    position: absolute;
    height: 40%;
    width: 40%;
  }
}
</style>
