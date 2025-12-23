<template>
  <span class="box">
    <span class="decor"></span>
  </span>
</template>

<style scoped lang="less">
span {
  display: block;
}

.box {
  transform-style: preserve-3d;
  perspective: calc(var(--size, 30px) / 3);
  position: relative;
  overflow: hidden;

  .decor {
    width: 100%;
    height: 100%;
    border: var(--color) calc(var(--size, 30px) / 6) outset;
    background-color: var(--color);
    position: relative;
    overflow: hidden;
    z-index: -1;

    &::after,
    &::before {
      content: '';
      position: absolute;
      width: 150%;
      background-color: white;
      translate: -20% -60%;
      rotate: -15deg;
      filter: blur(2px);
      opacity: 0.2;
    }

    &::after {
      height: calc(var(--size, 30px) / 6);
    }

    &::before {
      height: calc(var(--size, 30px) / 2);
    }
  }

  &::after,
  &::before {
    top: 0;
    left: 0;
    content: '';
    position: absolute;
    --panel: calc(var(--size, 30px) * 0.222);
    background-color: white;
  }

  &::before {
    width: 100%;
    height: var(--panel);
    translate: 0 -50%;
    transform: rotateX(90deg);
    opacity: 0.7;
  }

  &::after {
    width: var(--panel);
    height: 100%;
    translate: -50% 0;
    transform: rotateY(90deg);
    opacity: 0.3;
  }
}

[b1] {
  grid-area: b1;
}

[b2] {
  grid-area: b2;
}

[b3] {
  grid-area: b3;
}

[b4] {
  grid-area: b4;
}

[b5] {
  grid-area: b5;
}

[b6] {
  grid-area: b6;
}
</style>

