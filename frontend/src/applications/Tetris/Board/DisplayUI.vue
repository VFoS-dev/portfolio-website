<template>
  <div class="ui">
    <slot></slot>
  </div>
</template>

<style scoped lang="less">
@inset-depth: 4px;
@highlight: #ffffff;
@shadow: #808080;

.ui {
  width: calc(var(--size) * 5);
  padding: calc(var(--size) / 2) 0;
  min-height: calc(var(--size) * 3);
  background-color: #000000;
  border: @inset-depth inset @highlight;
  border-top-color: @shadow;
  border-left-color: @shadow;
  box-shadow: 
    inset 1px 1px 0 0 @shadow,
    inset -1px -1px 0 0 @highlight;
  display: flex;
  flex-direction: column;
  gap: calc(var(--size) / 2);
  align-items: center;
  justify-content: center;
}
</style>

