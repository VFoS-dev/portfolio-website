<template>
  <div class="ui">
    <slot></slot>
  </div>
</template>

<style scoped lang="less">
.ui {
  width: calc(var(--size) * 5);
  padding: calc(var(--size) / 2) 0;
  min-height: calc(var(--size) * 3);
  background-color: black;
  display: flex;
  flex-direction: column;
  gap: calc(var(--size) / 2);
  align-items: center;
  justify-content: center;
}
</style>

