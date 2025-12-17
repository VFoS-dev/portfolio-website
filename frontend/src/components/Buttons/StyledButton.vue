<template>
  <button>
    <slot></slot>
  </button>
</template>

<style lang="less" scoped>
button {
  align-items: center;
  background: linear-gradient(
    180deg,
    var(--gradient-top, #a7a297) 0,
    var(--gradient-bottom, #65593e) 100%
  );
  border: 2px solid var(--border-inner, #cdc0a2);
  border-radius: 8px;
  box-shadow:
    0 0 8px 8px rgba(0, 0, 0, 0.2) inset,
    0 0 0 1px var(--border-outer, #65593e);
  color: #fff;
  color: var(--color, #fff);
  display: flex;
  flex-direction: column;
  font-size: clamp(15px, 2.875vh, 23px);
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  overflow: hidden;
  padding: 15px 24px;
  -webkit-perspective: 25px;
  perspective: 25px;
  position: relative;
  text-shadow: 0 0 8px rgba(0, 0, 0, 0.5);
  transition:
    filter 0.25s,
    -webkit-filter 0.25s;
  cursor: pointer;

  &.blue {
    --border-outer: #0866b6;
    --border-inner: #021677;
    --gradient-top: #0165fc;
    --gradient-bottom: #3109ab;
    --decor-fill: #020677;
    --decor-border: #0846b6;
  }

  &.orange {
    --border-outer: #b65208;
    --border-inner: #773402;
    --gradient-top: #fcb601;
    --gradient-bottom: #ab6a09;
    --decor-fill: #773402;
    --decor-border: #b65208;
  }

  &:hover {
    filter: brightness(0.6);
  }

  &::before,
  &::after {
    background-color: var(--decor-fill, #6f685a);
    border: 2px solid var(--decor-border, #cdc0a2);
    border-radius: 3px;
    content: '';
    height: 15px;
    position: absolute;
    width: 40%;
  }

  &::before {
    top: 0;
    transform: translateY(-50%) rotateX(-45deg);
  }

  &::after {
    bottom: 0;
    transform: translateY(50%) rotateX(45deg);
  }
}
</style>
