<template>
  <div class="custom-field-form">
    <div class="form-content">
      <h3>Custom Field</h3>
      <div class="form-group">
        <label for="height">Height:</label>
        <input
          ref="heightInput"
          id="height"
          v-model.number="localHeight"
          type="number"
          min="9"
          max="24"
          @input="updateData"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        />
      </div>
      <div class="form-group">
        <label for="width">Width:</label>
        <input
          ref="widthInput"
          id="width"
          v-model.number="localWidth"
          type="number"
          min="9"
          max="30"
          @input="updateData"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        />
      </div>
      <div class="form-group">
        <label for="mines">Mines:</label>
        <input
          ref="minesInput"
          id="mines"
          v-model.number="localMines"
          type="number"
          min="10"
          :max="maxMines"
          @input="updateData"
          @focus="handleInputFocus"
          @blur="handleInputBlur"
        />
        <p class="hint">(max: {{ maxMines }})</p>
      </div>
      <div v-if="error" class="error-message">
        {{ error }}
      </div>
    </div>
    <div class="form-actions">
      <button
        type="button"
        class="submit-button"
        :disabled="!isValid || isSubmitting"
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
import { ref, computed, watch, onMounted } from 'vue';
import { useCubeStore } from '@/stores/cubeStore';

const cubeStore = useCubeStore();

const props = defineProps({
  height: {
    type: Number,
    default: 16,
  },
  width: {
    type: Number,
    default: 16,
  },
  mines: {
    type: Number,
    default: 40,
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

const localHeight = ref(props.height);
const localWidth = ref(props.width);
const localMines = ref(props.mines);
const error = ref('');
const heightInput = ref(null);
const widthInput = ref(null);
const minesInput = ref(null);

watch(
  () => [props.height, props.width, props.mines],
  ([height, width, mines]) => {
    localHeight.value = height;
    localWidth.value = width;
    localMines.value = mines;
  }
);

const maxMines = computed(() => {
  return Math.max(10, localHeight.value * localWidth.value - 1);
});

function validateInput() {
  error.value = '';

  // Clamp values to valid ranges
  if (localHeight.value < 9) localHeight.value = 9;
  if (localHeight.value > 24) localHeight.value = 24;
  if (localWidth.value < 9) localWidth.value = 9;
  if (localWidth.value > 30) localWidth.value = 30;

  // Auto-adjust mines if it exceeds max
  const max = localHeight.value * localWidth.value - 1;
  if (localMines.value > max) {
    localMines.value = max;
  }
  if (localMines.value < 10) {
    localMines.value = 10;
  }

  // Validate ranges
  if (localHeight.value < 9 || localHeight.value > 24) {
    error.value = 'Height must be between 9 and 24.';
    return false;
  }

  if (localWidth.value < 9 || localWidth.value > 30) {
    error.value = 'Width must be between 9 and 30.';
    return false;
  }

  if (localMines.value < 10 || localMines.value > max) {
    error.value = `Mines must be between 10 and ${max}.`;
    return false;
  }

  return true;
}

function updateData() {
  validateInput();
  emit('update:model-value', {
    height: localHeight.value,
    width: localWidth.value,
    mines: localMines.value,
  });
}

function handleSubmit() {
  if (validateInput() && props.onSubmit) {
    props.onSubmit({
      height: localHeight.value,
      width: localWidth.value,
      mines: localMines.value,
    });
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
  // Auto-focus the first input when component mounts
  if (heightInput.value) {
    heightInput.value.focus();
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

.custom-field-form {
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
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;

    label {
      min-width: 60px;
      font-weight: normal;
      color: @text-color;
      font-size: 11px;
    }

    input {
      flex: 1;
      max-width: 80px;
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
      font-size: 10px;
      color: #666;
      font-style: normal;
      white-space: nowrap;
    }
  }

  .error-message {
    color: #ff0000;
    font-size: 10px;
    margin-top: -8px;
    min-height: 14px;
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
