<template>
  <div class="piece">
    <slot></slot>
  </div>
</template>

<style scoped lang="less">
.piece {
  display: grid;
  grid-template-columns: repeat(var(--width, 1), 1fr);
  grid-template-rows: repeat(var(--height, 1), 1fr);
  height: calc(var(--size, 30px) * var(--height, 1));
  width: calc(var(--size, 30px) * var(--width, 1));

  &.s2x2 {
    --width: 2;
    --height: 2;
    grid-template-areas:
      'b1 b2'
      'b3 b4';
  }

  &.s3x2 {
    --width: 3;
    --height: 2;
    grid-template-areas:
      'b1 b2 b3'
      'b4 b5 b6';
  }

  &.s4x1 {
    --width: 4;
    --height: 1;
    grid-template-areas: 'b1 b2 b3 b4';
  }
}

.ui .s4x1 {
  margin: calc(var(--size, 30px) / 2) 0;
}
</style>
