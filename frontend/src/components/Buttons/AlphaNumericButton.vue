<template>
  <button :class="{ alpha: state }" @click="state = !state">
    <span></span>
  </button>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  size: { type: String, default: '2.5rem' },
  clicked: { type: Boolean, default: false },
});

const state = ref(props.clicked);
</script>

<style lang="less" scoped>
button {
  --s-size: var(--size, 2.5rem);
  position: relative;
  height: var(--s-size);
  width: var(--s-size);
  padding: 0;
  background-color: transparent;
  border: transparent;
  cursor: pointer;

  &:hover {
    --text-color: grey;
  }

  &::after,
  &::before,
  span {
    --height: 3px;
    --width: 100%;
    content: '';
    position: absolute;
    background-color: var(--text-color);
    top: calc(50% - var(--height) / 2);
    left: calc(50% - var(--width) / 2);
    height: var(--height);
    width: var(--width);
    transition: width, transform, top, left, background-color;
    transition-duration: 0.25s;
  }

  &::before {
    transform: translateY(calc(-1 * var(--s-size) / 3.5));
  }

  span {
    --width: 75%;
    left: 0;
  }

  &::after {
    --width: 50%;
    left: 0;
    transform: translateY(calc(var(--s-size) / 3.5));
  }

  &.alpha {
    &::before {
      left: calc(50% - var(--width) / 2);
      transform: rotate(70deg) translate(5%, -125%);
    }

    span {
      left: calc(50% - var(--width) / 2);
      transform: rotate(-70deg) translate(-25%, -125%);
    }

    &::after {
      top: 40%;
      left: calc(50% - var(--width) / 2);
      transform: translateY(calc(var(--s-size) / 3.5));
    }
  }
}
</style>
