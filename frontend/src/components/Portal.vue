<template>
  <Teleport :key="disabled" :to="to" :disabled="disabled">
    <slot></slot>
  </Teleport>
</template>

<script setup>
defineProps({
  to: String,
  disabled: Boolean,
});
</script>
