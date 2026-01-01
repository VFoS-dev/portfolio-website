<template>
  <div v-if="error" class="error">
    {{ error }}
  </div>
</template>

<script setup>
defineProps({
  error: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
.error {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 6px;
  background-color: #f8d7da;
  color: #721c24;
  border: 1px solid #f5c6cb;
}
</style>

