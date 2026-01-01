<template>
  <div class="no-data">
    {{ message || 'No data found' }}
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: 'No data found'
  }
})
</script>

<style scoped>
.no-data {
  text-align: center;
  padding: 3rem;
  color: var(--color-text);
  font-size: 1.1rem;
  background: var(--color-background-soft);
  border-radius: 8px;
  border: 1px dashed var(--color-border);
}
</style>

