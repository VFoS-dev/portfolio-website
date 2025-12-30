<template>
  <div class="empty-trash-form">
    <div class="form-content">
      <h3>Empty Trash</h3>
      <div class="form-group">
        <p class="message">Are you sure you want to permanently delete all items in the Trash?</p>
      </div>
    </div>
    <div class="form-actions">
      <button
        type="button"
        class="submit-button"
        :disabled="isSubmitting"
        @click="handleSubmit"
      >
        OK
      </button>
      <button
        type="button"
        class="cancel-button"
        :disabled="isSubmitting"
        @click="handleCancel"
      >
        Cancel
      </button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false,
  },
  isValid: {
    type: Boolean,
    default: true,
  },
  onSubmit: {
    type: Function,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

function handleSubmit() {
  if (props.onSubmit) {
    props.onSubmit({});
  }
}

function handleCancel() {
  emit('cancel');
}
</script>

<style lang="less" scoped>
@window-bg: #ece9d8;
@border-light: #ffffff;
@border-dark: #808080;
@button-bg: #ece9d8;
@button-hover: #d4d0c8;
@text-color: #000000;

.empty-trash-form {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: @window-bg;
  font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
  font-size: 11px;
  color: @text-color;
}

.form-content {
  flex: 1;
  padding: 12px;
  overflow-y: auto;

  h3 {
    margin: 0 0 16px 0;
    color: @text-color;
    font-size: 12px;
    font-weight: bold;
  }

  .form-group {
    .message {
      margin: 0;
      color: @text-color;
      font-size: 11px;
      line-height: 1.4;
    }
  }
}

.form-actions {
  display: flex;
  gap: 8px;
  padding: 8px;
  border-top: 1px solid @border-dark;
  border-left: 1px solid @border-light;
  border-right: 1px solid @border-dark;
  border-bottom: 1px solid @border-light;
  background: linear-gradient(to bottom, #ece9d8 0%, #d4d0c8 100%);
  justify-content: flex-end;
}

.submit-button,
.cancel-button {
  padding: 4px 16px;
  min-width: 75px;
  background: @button-bg;
  border: 1px outset @button-bg;
  border-top-color: @border-light;
  border-left-color: @border-light;
  border-right-color: @border-dark;
  border-bottom-color: @border-dark;
  cursor: pointer;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
  color: @text-color;
  box-shadow: 
    inset -1px -1px @border-dark,
    inset 1px 1px @border-light;

  &:hover:not(:disabled) {
    background: @button-hover;
  }

  &:active:not(:disabled) {
    border: 1px inset @button-bg;
    border-top-color: @border-dark;
    border-left-color: @border-dark;
    border-right-color: @border-light;
    border-bottom-color: @border-light;
    box-shadow: 
      inset 1px 1px @border-dark,
      inset -1px -1px @border-light;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
}
</style>

