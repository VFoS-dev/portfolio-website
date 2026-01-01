<template>
  <div class="reset-all-form">
    <div class="form-content">
      <h3>Reset All</h3>
      <p class="warning-message">
        Are you sure you want to reset all? This will:
      </p>
      <ul class="warning-list">
        <li>Remove all modified files</li>
        <li>Delete all custom saved icons</li>
        <li>Clear the trash</li>
        <li>Reset the desktop background</li>
      </ul>
      <p class="warning-message">
        <strong>This action cannot be undone.</strong>
      </p>
    </div>
    <div class="form-actions">
      <button
        type="button"
        class="submit-button"
        :disabled="isSubmitting"
        @click="handleSubmit"
      >
        Reset All
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
import { cubeStore } from '@/stores/cubeStore';

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

const emit = defineEmits(['update:model-value', 'submit', 'cancel']);

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
@warning-color: #ff0000;

.reset-all-form {
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
    margin: 0 0 12px 0;
    color: @text-color;
    font-size: 12px;
    font-weight: bold;
  }

  .warning-message {
    margin: 8px 0;
    color: @text-color;
    font-size: 11px;
    line-height: 1.4;

    strong {
      color: @warning-color;
      font-weight: bold;
    }
  }

  .warning-list {
    margin: 8px 0 8px 20px;
    padding: 0;
    color: @text-color;
    font-size: 11px;
    line-height: 1.6;

    li {
      margin: 4px 0;
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

.submit-button {
  color: @warning-color;
  font-weight: bold;
}
</style>
