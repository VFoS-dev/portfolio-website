<template>
  <RouterLink :to="to">
    <span v-for="state of states" :key="state" :class="state">
      <slot></slot>
    </span>
  </RouterLink>
</template>

<script setup>
defineProps({ to: String });

const states = ['default', 'hover', 'active'];
</script>

<style scoped lang="less">
a {
  --gradiant: white, orange, white;
  --active: #38495a, white, #38495a;
  --hover: orange, white, orange;

  --default-opacity: 1;
  --hover-opacity: 0;
  --active-opacity: 0;

  position: relative;
  font-family: 'lato', sans-serif;
  font-size: clamp(1.125rem, 4vw, 1.875rem);
  text-decoration: none;

  &:hover {
    --hover-opacity: 1;
    --active-opacity: 0;
  }

  &.router-link-active:not(:hover) {
    --hover-opacity: 0;
    --active-opacity: 1;
  }

  span {
    display: block;
    background: -webkit-linear-gradient(var(--gradiant));
    background-clip: text;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    text-transform: capitalize;
    transition:
      background 0.5s,
      opacity 0.25s linear;

    &.active,
    &.hover {
      position: absolute;
      top: 0;
      left: 0;
    }

    &.active {
      --gradiant: var(--active);
      opacity: var(--active-opacity);
      text-shadow: rgb(183, 211, 223) 1px 0 10px;
    }

    &.hover {
      --gradiant: var(--hover);
      opacity: var(--hover-opacity);
      text-shadow: rgb(221, 196, 94) 1px 0 10px;
    }

    &.default {
      opacity: 1;
    }
  }
}
</style>

<style lang="less">
// Mobile nav specific scaling - unscoped to target #mobile-nav
#mobile-nav a {
  font-size: clamp(1.25rem, 5vw, 2rem);
}
</style>
