<template>
  <div class="form-container">
    <h2 v-if="title">{{ title }}</h2>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
.form-container {
  background: var(--color-background-soft);
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  border: 1px solid var(--color-border);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-container h2 {
  color: var(--color-heading);
  margin-top: 0;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
}
</style>

