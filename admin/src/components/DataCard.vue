<template>
  <div class="data-card">
    <div class="card-header">
      <h3>{{ title }}</h3>
      <div class="card-actions">
        <button v-if="showEdit" @click="$emit('edit')" class="btn btn-edit">Edit</button>
        <button 
          v-if="showToggleDeactivate" 
          @click="$emit('toggle-deactivate')" 
          class="btn" 
          :class="isDeactivated ? 'btn-activate' : 'btn-deactivate'"
        >
          {{ isDeactivated ? 'Activate' : 'Deactivate' }}
        </button>
        <button 
          v-if="showDelete" 
          @click="$emit('delete')" 
          class="btn btn-delete"
          :disabled="deleteDisabled"
          :title="deleteDisabled ? deleteDisabledTitle : 'Delete'"
        >
          Delete
        </button>
        <slot name="actions" />
      </div>
    </div>
    <slot />
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  showEdit: {
    type: Boolean,
    default: true
  },
  showToggleDeactivate: {
    type: Boolean,
    default: true
  },
  showDelete: {
    type: Boolean,
    default: true
  },
  isDeactivated: {
    type: Boolean,
    default: false
  },
  deleteDisabled: {
    type: Boolean,
    default: false
  },
  deleteDisabledTitle: {
    type: String,
    default: 'Cannot delete'
  }
})

defineEmits(['edit', 'toggle-deactivate', 'delete'])
</script>

<style scoped>
.data-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  margin-bottom: 1rem;
  transition: box-shadow 0.2s;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.data-card:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.card-header h3 {
  margin: 0;
  color: var(--color-heading);
  font-size: 1.25rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-edit {
  background-color: #ffc107;
  color: #000;
}

.btn-edit:hover {
  background-color: #e0a800;
}

.btn-delete {
  background-color: #dc3545;
  color: white;
}

.btn-delete:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-delete:disabled {
  background-color: #6c757d;
  color: #fff;
  cursor: not-allowed;
  opacity: 0.6;
}

.btn-deactivate {
  background-color: #ffc107;
  color: #000;
}

.btn-deactivate:hover {
  background-color: #e0a800;
}

.btn-activate {
  background-color: #28a745;
  color: white;
}

.btn-activate:hover {
  background-color: #218838;
}
</style>

