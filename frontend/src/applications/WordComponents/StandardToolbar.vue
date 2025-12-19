<template>
  <div class="toolbar standard-toolbar">
    <button class="toolbar-btn" title="New" @click="$emit('new')">
      <span class="icon">📄</span>
    </button>
    <button class="toolbar-btn" title="Open" @click="$emit('open')">
      <span class="icon">📁</span>
    </button>
    <button class="toolbar-btn" title="Save" @click="$emit('save')">
      <span class="icon">💾</span>
    </button>
    <div class="toolbar-separator"></div>
    <button class="toolbar-btn" title="Cut" @click="$emit('cut')">
      <span class="icon">✂️</span>
    </button>
    <button class="toolbar-btn" title="Copy" @click="$emit('copy')">
      <span class="icon">📋</span>
    </button>
    <button class="toolbar-btn" title="Paste" @click="$emit('paste')">
      <span class="icon">📄</span>
    </button>
    <div class="toolbar-separator"></div>
    <button 
      class="toolbar-btn" 
      title="Undo" 
      @click="$emit('undo')" 
      :disabled="!canUndo"
    >
      <span class="icon">↶</span>
    </button>
    <button 
      class="toolbar-btn" 
      title="Redo" 
      @click="$emit('redo')" 
      :disabled="!canRedo"
    >
      <span class="icon">↷</span>
    </button>
  </div>
</template>

<script setup>
defineProps({
  canUndo: {
    type: Boolean,
    default: false,
  },
  canRedo: {
    type: Boolean,
    default: false,
  },
});

defineEmits(['new', 'open', 'save', 'cut', 'copy', 'paste', 'undo', 'redo']);
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
    
    .icon {
      font-size: 14px;
    }
  }
  
  .toolbar-separator {
    width: 1px;
    height: 20px;
    background: #808080;
    margin: 0 4px;
  }
}
</style>
