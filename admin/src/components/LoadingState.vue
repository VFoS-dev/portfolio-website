<template>
  <div v-if="loading" class="loading">
    {{ message || 'Loading...' }}
  </div>
</template>

<script setup>
defineProps({
  loading: {
    type: Boolean,
    required: true
  },
  message: {
    type: String,
    default: 'Loading...'
  }
})
</script>

<style scoped>
.loading {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 6px;
  background-color: #e7f3ff;
  color: #004085;
  text-align: center;
}
</style>

