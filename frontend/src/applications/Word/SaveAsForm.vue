<template>
  <div class="save-as-form">
    <div class="form-content">
      <h3>Save Document As</h3>
      <div class="form-group">
        <label for="fileName">File Name:</label>
        <input
          ref="fileNameInput"
          id="fileName"
          v-model="localFileName"
          type="text"
          placeholder="Enter file name"
          @input="updateData"
          @keyup.enter="handleEnter"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        />
        <p class="hint">The file will be saved as: {{ fileNameWithExtension }}</p>
      </div>
    </div>
    <div class="form-actions">
      <button
        type="button"
        class="submit-button"
        :disabled="!isValid || isSubmitting"
        @click="handleSubmit"
      >
        Save
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
import { ref, computed, watch, onMounted } from 'vue';
import { cubeStore } from '@/stores/cubeStore';

const props = defineProps({
  fileName: {
    type: String,
    default: '',
  },
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

const localFileName = ref(props.fileName || '');
const fileNameInput = ref(null);

watch(() => props.fileName, (newValue) => {
  localFileName.value = newValue;
});

const fileNameWithExtension = computed(() => {
  if (!localFileName.value) return '';
  return localFileName.value.endsWith('.doc') 
    ? localFileName.value 
    : `${localFileName.value}.doc`;
});

function updateData() {
  emit('update:model-value', { fileName: localFileName.value });
}

function handleSubmit() {
  if (localFileName.value.trim() && props.onSubmit) {
    props.onSubmit({ fileName: localFileName.value.trim() });
  }
}

function handleEnter() {
  if (localFileName.value.trim()) {
    handleSubmit();
  }
}

function handleCancel() {
  emit('cancel');
}

function handleInputFocus() {
  cubeStore.toggleKeyRotate(false);
}

function handleInputBlur() {
  cubeStore.toggleKeyRotate(true);
}

onMounted(() => {
  // Auto-focus the input when component mounts
  if (fileNameInput.value) {
    fileNameInput.value.focus();
  }
});
</script>

<style lang="less" scoped>
@window-bg: #ece9d8;
@border-light: #ffffff;
@border-dark: #808080;
@button-bg: #ece9d8;
@button-hover: #d4d0c8;
@text-color: #000000;

.save-as-form {
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
    label {
      display: block;
      margin-bottom: 6px;
      font-weight: normal;
      color: @text-color;
      font-size: 11px;
    }

    input {
      width: 100%;
      padding: 4px;
      border: 1px inset @window-bg;
      border-top-color: @border-dark;
      border-left-color: @border-dark;
      border-right-color: @border-light;
      border-bottom-color: @border-light;
      box-shadow: 
        inset 1px 1px 0 0 @border-dark,
        inset -1px -1px 0 0 @border-light;
      font-size: 11px;
      font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
      box-sizing: border-box;
      background: #ffffff;

      &:focus {
        outline: none;
      }
    }

    .hint {
      margin-top: 4px;
      font-size: 10px;
      color: #666;
      font-style: normal;
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
