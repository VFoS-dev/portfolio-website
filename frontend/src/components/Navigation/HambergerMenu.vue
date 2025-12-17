<template>
  <button>
    <div></div>
  </button>
</template>

<style scoped lang="less">
button {
  --color: white;
  cursor: pointer;
  padding: 0;
  width: 30px;
  height: 30px;
  border: none;
  background-color: transparent;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover,
  &:focus {
    --color: grey;
  }
}

div,
div::before,
div::after {
  left: 0;
  content: '';
  width: 100%;
  height: 2px;
  position: absolute;
  background-color: var(--color);
  transition: background-color;
}

div {
  width: 70%;
  position: relative;

  &::before {
    transform: translateY(-8px);
    // transition-delay: var(--h-m-delay, 0s);
  }

  transition-delay: var(--h-m-delay, 0.125s);

  &::after {
    transform: translateY(8px);
    transition-delay: var(--h-m-delay, 0.25s);
  }
}

@media (prefers-reduced-motion) {
  div {
    --h-m-delay: 0s;
  }
}
</style>
