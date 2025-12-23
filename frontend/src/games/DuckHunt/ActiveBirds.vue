<template>
  <MenuItem class="active">
    <span>BIRDS</span>
    <div class="container">
      <div v-for="bird of Object.values(props.birds)" :key="bird.id" :alive="bird.alive"></div>
    </div>
  </MenuItem>
</template>

<script setup>
import MenuItem from './MenuItem.vue';

const props = defineProps({
  birds: { type: Object, default: () => ({}) },
});
</script>

<style lang="less" scoped>
.active {
  flex-direction: row;
  align-items: flex-end;
  gap: 0.5rem;
  --margin: 1rem;
  left: var(--margin);
  bottom: var(--margin);
}

.container {
  --gap: 1px;
  --count: 20;
  --size: 8px;
  display: flex;
  flex-wrap: wrap-reverse;
  align-self: center;
  gap: var(--gap);
  max-width: calc(var(--size) * var(--count) + var(--gap) * (var(--count) - 1));
}

div[alive] {
  height: 8px;
  width: 8px;
  background: url(/images/about/sprite_sheet.webp);
  background-position: 26px 21.5px;

  &[alive='false'] {
    background-position-x: 17px;
  }
}
</style>
