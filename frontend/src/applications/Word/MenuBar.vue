<template>
  <div class="menu-bar">
    <div 
      class="menu-item" 
      @click="toggleFileMenu" 
      @mouseleave="handleMenuMouseLeave('file', $event)" 
      @mouseenter="handleMenuMouseEnter('file')"
    >
      File
      <div 
        v-if="showFileMenu" 
        class="menu-dropdown" 
        @mouseleave="handleMenuMouseLeave('file', $event)" 
        @mouseenter="handleMenuMouseEnter('file')"
      >
        <div class="menu-option" @click="handleSave">Save</div>
        <div class="menu-option" @click="handleSaveAs">Save As...</div>
        <div class="menu-separator"></div>
        <div class="menu-option" @click="handleExport">Export...</div>
      </div>
    </div>
    <div 
      class="menu-item" 
      @click="toggleEditMenu" 
      @mouseleave="handleMenuMouseLeave('edit', $event)" 
      @mouseenter="handleMenuMouseEnter('edit')"
    >
      Edit
      <div 
        v-if="showEditMenu" 
        class="menu-dropdown" 
        @mouseleave="handleMenuMouseLeave('edit', $event)" 
        @mouseenter="handleMenuMouseEnter('edit')"
      >
        <div class="menu-option" @click="handleUndo" :class="{ disabled: !canUndo }">Undo</div>
        <div class="menu-option" @click="handleRedo" :class="{ disabled: !canRedo }">Redo</div>
        <template v-if="showReset">
          <div class="menu-separator"></div>
          <div class="menu-option" @click="handleReset" :class="{ disabled: !hasBeenModified }">Reset to Original</div>
        </template>
      </div>
    </div>
    <div class="menu-item disabled">View</div>
    <div class="menu-item disabled">Insert</div>
    <div class="menu-item disabled">Format</div>
    <div class="menu-item disabled">Tools</div>
    <div class="menu-item disabled">Table</div>
    <div class="menu-item disabled">Window</div>
    <div class="menu-item disabled">Help</div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  canUndo: {
    type: Boolean,
    default: false,
  },
  canRedo: {
    type: Boolean,
    default: false,
  },
  hasBeenModified: {
    type: Boolean,
    default: false,
  },
  showReset: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['save', 'save-as', 'export', 'undo', 'redo', 'reset']);

const showFileMenu = ref(false);
const showEditMenu = ref(false);
let menuLeaveTimeout = null;

function toggleFileMenu() {
  showFileMenu.value = !showFileMenu.value;
  showEditMenu.value = false;
}

function toggleEditMenu() {
  showEditMenu.value = !showEditMenu.value;
  showFileMenu.value = false;
}

function handleMenuMouseEnter(menuType) {
  if (menuLeaveTimeout) {
    clearTimeout(menuLeaveTimeout);
    menuLeaveTimeout = null;
  }
}

function handleMenuMouseLeave(menuType, event) {
  if (menuLeaveTimeout) {
    clearTimeout(menuLeaveTimeout);
  }
  
  menuLeaveTimeout = setTimeout(() => {
    const relatedTarget = event.relatedTarget;
    const isMenuElement = relatedTarget && (
      relatedTarget.closest('.menu-item') || 
      relatedTarget.closest('.menu-dropdown')
    );
    
    if (!isMenuElement) {
      if (menuType === 'file') {
        showFileMenu.value = false;
      } else if (menuType === 'edit') {
        showEditMenu.value = false;
      }
    }
    
    menuLeaveTimeout = null;
  }, 150);
}

function handleSave() {
  showFileMenu.value = false;
  emit('save');
}

function handleSaveAs() {
  showFileMenu.value = false;
  emit('save-as');
}

function handleExport() {
  showFileMenu.value = false;
  emit('export');
}

function handleUndo() {
  emit('undo');
  showEditMenu.value = false;
}

function handleRedo() {
  emit('redo');
  showEditMenu.value = false;
}

function handleReset() {
  emit('reset');
  showEditMenu.value = false;
}
</script>

<style lang="less" scoped>
.menu-bar {
  display: flex;
  background: #d4d0c8;
  border-bottom: 1px solid #808080;
  padding: 2px 0;
  font-size: 11px;
  user-select: none;
  
  .menu-item {
    padding: 4px 12px;
    cursor: pointer;
    position: relative;
    border: 1px solid transparent;
    
    &:hover {
      background: #316ac5;
      color: white;
      border: 1px solid #003c74;
    }
    
    &.disabled {
      opacity: 0.5;
      cursor: default;
      color: #808080;
      
      &:hover {
        background: transparent;
        color: #808080;
        border: 1px solid transparent;
      }
    }
    
    .menu-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      background: #d4d0c8;
      border: 1px solid #808080;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      min-width: 150px;
      color: #000000;
      
      .menu-option {
        padding: 4px 20px;
        cursor: pointer;
        color: #000000;
        
        &:hover:not(.disabled) {
          background: #316ac5;
          color: white;
        }
        
        &.disabled {
          opacity: 0.5;
          cursor: not-allowed;
          color: #000000;
        }
      }
      
      .menu-separator {
        height: 1px;
        background: #808080;
        margin: 2px 0;
      }
    }
  }
}
</style>
