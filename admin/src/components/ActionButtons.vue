<template>
  <div class="actions">
    <button v-if="showRefresh" @click="$emit('refresh')" class="btn btn-primary">
      Refresh
    </button>
    <button v-if="showCreate" @click="$emit('create')" class="btn btn-success">
      {{ createLabel }}
    </button>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  showRefresh: {
    type: Boolean,
    default: true
  },
  showCreate: {
    type: Boolean,
    default: true
  },
  createLabel: {
    type: String,
    default: 'Create New'
  }
})

defineEmits(['refresh', 'create'])
</script>

<style scoped>
.actions {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 500;
  transition: all 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}
</style>

