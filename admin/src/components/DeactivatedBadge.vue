<template>
  <p v-if="isDeactivated" class="deactivated-badge">⚠️ Deactivated</p>
</template>

<script setup>
defineProps({
  isDeactivated: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.deactivated-badge {
  color: #856404;
  background-color: #fff3cd;
  padding: 0.5rem;
  border-radius: 4px;
  font-weight: bold;
  margin-bottom: 0.5rem;
  display: inline-block;
}
</style>

