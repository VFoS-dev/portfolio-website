<template>
  <div class="toolbar formatting-toolbar">
    <!-- Font Type -->
    <select v-model="localSelectedFont" @change="handleFontChange" class="font-selector">
      <optgroup
        v-for="group in availableFonts"
        :key="group.group"
        :label="group.group"
      >
        <option
          v-for="font in group.fonts"
          :key="font"
          :value="font"
          :style="{ fontFamily: font }"
        >
          {{ font }}
        </option>
      </optgroup>
    </select>

    <!-- Font Size -->
    <select v-model="localSelectedFontSize" @change="handleFontSizeChange" class="font-size-selector">
      <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}</option>
    </select>

    <div class="toolbar-separator"></div>

    <!-- Formatting Buttons -->
    <button
      class="toolbar-btn"
      :class="{ active: isBold }"
      title="Bold"
      @click="$emit('toggle-bold')"
    >
      <strong>B</strong>
    </button>
    <button
      class="toolbar-btn"
      :class="{ active: isItalic }"
      title="Italic"
      @click="$emit('toggle-italic')"
    >
      <em>I</em>
    </button>
    <button
      class="toolbar-btn"
      :class="{ active: isUnderline }"
      title="Underline"
      @click="$emit('toggle-underline')"
    >
      <u>U</u>
    </button>

    <div class="toolbar-separator"></div>

    <!-- Alignment Buttons -->
    <button
      class="toolbar-btn"
      :class="{ active: isLeftAlign }"
      title="Align Left"
      @click="$emit('align-left')"
    >
      <span class="icon">⬅</span>
    </button>
    <button
      class="toolbar-btn"
      :class="{ active: isCenterAlign }"
      title="Center"
      @click="$emit('align-center')"
    >
      <span class="icon">⬌</span>
    </button>
    <button
      class="toolbar-btn"
      :class="{ active: isRightAlign }"
      title="Align Right"
      @click="$emit('align-right')"
    >
      <span class="icon">➡</span>
    </button>
    <button
      class="toolbar-btn"
      :class="{ active: isJustifyAlign }"
      title="Justify"
      @click="$emit('align-justify')"
    >
      <span class="icon">⬌⬌</span>
    </button>

    <div class="toolbar-separator"></div>

    <!-- List Buttons -->
    <button
      class="toolbar-btn"
      :class="{ active: isBulletList }"
      title="Bulleted List"
      @click="$emit('toggle-bullet-list')"
    >
      <span class="icon">•</span>
    </button>
    <button
      class="toolbar-btn"
      :class="{ active: isOrderedList }"
      title="Numbered List"
      @click="$emit('toggle-ordered-list')"
    >
      <span class="icon">123</span>
    </button>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  selectedFont: {
    type: String,
    default: 'Times New Roman',
  },
  selectedFontSize: {
    type: Number,
    default: 12,
  },
  availableFonts: {
    type: Array,
    required: true,
  },
  fontSizes: {
    type: Array,
    default: () => [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72],
  },
  isBold: {
    type: Boolean,
    default: false,
  },
  isItalic: {
    type: Boolean,
    default: false,
  },
  isUnderline: {
    type: Boolean,
    default: false,
  },
  isLeftAlign: {
    type: Boolean,
    default: true,
  },
  isCenterAlign: {
    type: Boolean,
    default: false,
  },
  isRightAlign: {
    type: Boolean,
    default: false,
  },
  isJustifyAlign: {
    type: Boolean,
    default: false,
  },
  isBulletList: {
    type: Boolean,
    default: false,
  },
  isOrderedList: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits([
  'update:selectedFont',
  'update:selectedFontSize',
  'font-change',
  'font-size-change',
  'toggle-bold',
  'toggle-italic',
  'toggle-underline',
  'align-left',
  'align-center',
  'align-right',
  'align-justify',
  'toggle-bullet-list',
  'toggle-ordered-list',
]);

const localSelectedFont = ref(props.selectedFont);
const localSelectedFontSize = ref(props.selectedFontSize);

watch(() => props.selectedFont, (newVal) => {
  localSelectedFont.value = newVal;
});

watch(() => props.selectedFontSize, (newVal) => {
  localSelectedFontSize.value = newVal;
});

function handleFontChange() {
  emit('update:selectedFont', localSelectedFont.value);
  emit('font-change', localSelectedFont.value);
}

function handleFontSizeChange() {
  emit('update:selectedFontSize', localSelectedFontSize.value);
  emit('font-size-change', localSelectedFontSize.value);
}
</script>

<style lang="less" scoped>
.toolbar {
  display: flex;
  align-items: center;
  background: #d4d0c8;
  border-bottom: 1px solid #808080;
  padding: 4px;
  gap: 2px;
  
  .toolbar-btn {
    background: #d4d0c8;
    border: 1px solid #808080;
    border-top-color: #ffffff;
    border-left-color: #ffffff;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 12px;
    min-width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover:not(:disabled) {
      background: #e8e4d8;
    }
    
    &:active:not(:disabled) {
      border-top-color: #808080;
      border-left-color: #808080;
      border-bottom-color: #ffffff;
      border-right-color: #ffffff;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &.active {
      background: #c0c0c0;
      border-top-color: #808080;
      border-left-color: #808080;
      border-bottom-color: #ffffff;
      border-right-color: #ffffff;
    }
    
    .icon {
      font-size: 14px;
    }
    
    strong, em, u {
      font-weight: bold;
      font-style: normal;
      text-decoration: none;
    }
  }
  
  .toolbar-separator {
    width: 1px;
    height: 20px;
    background: #808080;
    margin: 0 4px;
  }
  
  .font-selector,
  .font-size-selector {
    background: white;
    border: 1px solid #808080;
    padding: 2px 4px;
    font-size: 11px;
    height: 22px;
    cursor: pointer;
  }
  
  .font-selector {
    width: 200px;
  }
  
  .font-size-selector {
    width: 50px;
  }
}
</style>
