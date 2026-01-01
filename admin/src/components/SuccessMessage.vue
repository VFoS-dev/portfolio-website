<template>
  <div v-if="message" class="success">
    {{ message }}
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
.success {
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 6px;
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}
</style>

