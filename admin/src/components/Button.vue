<template>
  <button 
    :type="type" 
    :disabled="disabled"
    :class="['btn', `btn-${variant}`, `btn-${size}`, { 'btn-disabled': disabled }]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<script setup>
defineProps({
  type: {
    type: String,
    default: 'button'
  },
  variant: {
    type: String,
    default: 'primary',
    validator: (value) => ['primary', 'secondary', 'success', 'danger', 'warning'].includes(value)
  },
  disabled: {
    type: Boolean,
    default: false
  },
  size: {
    type: String,
    default: 'normal',
    validator: (value) => ['small', 'normal'].includes(value)
  }
})

defineEmits(['click'])
</script>

<style scoped>
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

.btn:hover:not(.btn-disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.15);
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover:not(.btn-disabled) {
  background-color: #0056b3;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover:not(.btn-disabled) {
  background-color: #5a6268;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover:not(.btn-disabled) {
  background-color: #218838;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover:not(.btn-disabled) {
  background-color: #c82333;
}

.btn-warning {
  background-color: #ffc107;
  color: #000;
}

.btn-warning:hover:not(.btn-disabled) {
  background-color: #e0a800;
}

.btn-disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-small {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}
</style>

