<template>
  <div class="recycle-bin">
    <div class="toolbar">
      <button class="toolbar-button" @click="handleEmptyTrash" :disabled="deletedIcons.length === 0">
        <span class="button-text">Empty Trash</span>
      </button>
    </div>
    <div class="content-area">
      <div v-if="deletedIcons.length === 0" class="empty-state">
        <div class="empty-icon">🗑️</div>
        <p class="empty-text">The Trash is empty</p>
      </div>
      <div v-else class="icons-grid">
        <div
          v-for="(icon, index) in deletedIcons"
          :key="`deleted-${index}-${icon.deletedAt}`"
          class="deleted-icon-item"
          @dblclick="handleRestore(icon)"
        >
          <div class="icon-wrapper">
            <img :src="icon['desktop-icon'] || icon.icon" :alt="icon.title" />
          </div>
          <p class="icon-label">{{ icon.title }}</p>
          <div class="icon-actions">
            <button class="restore-button" @click.stop="handleRestore(icon)" title="Restore">
              Restore
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue';
import { useTrashStore } from '@/stores/trashStore';

const trashStore = useTrashStore();
import { useWindowStore } from '@/stores/windowStore';

const windowStore = useWindowStore();
import EmptyTrashConfirmationForm from './RecycleBin/EmptyTrashConfirmationForm.vue';

const windowId = inject('windowId', null);

const deletedIcons = computed(() => trashStore.getDeletedIcons);

function handleRestore(iconConfig) {
  const restored = trashStore.restoreIcon(iconConfig);
  if (restored) {
    // Emit event to parent to refresh desktop icons
    window.dispatchEvent(new CustomEvent('icon-restored', { detail: restored }));
  }
}

function handleEmptyTrash() {
  if (deletedIcons.value.length === 0) {
    return;
  }
  
  // Calculate center position for the window
  const windowWidth = 280;
  const windowHeight = 160;
  const left = (window.innerWidth - windowWidth) / 2;
  const top = (window.innerHeight - windowHeight) / 2;
  
  // Create a Submittable window for empty trash confirmation
  const emptyTrashWindow = windowStore.createWindow({
    title: 'Empty Trash',
    icon: '/images/resume/recyclebin_full.svg',
    app: 'Submittable',
    width: windowWidth,
    height: windowHeight,
    left: left,
    top: top,
    appProps: {
      component: EmptyTrashConfirmationForm,
      componentProps: {},
      initialData: {},
      validate: () => true,
      onSubmit: async () => {
        trashStore.emptyTrash();
        
        // Close the Empty Trash window
        windowStore.closeWindow(emptyTrashWindow.id);
        
        // Refocus the RecycleBin window
        if (windowId) {
          windowStore.focusWindow(windowId);
        }
        
        return { success: true };
      },
    },
  });
}
</script>

<style lang="less" scoped>
@window-bg: #ece9d8;
@border-light: #ffffff;
@border-dark: #808080;
@button-bg: #ece9d8;
@button-hover: #d4d0c8;
@button-active: #c0c0c0;
@text-color: #000000;

.recycle-bin {
  width: 100%;
  height: 100%;
  background: @window-bg;
  display: flex;
  flex-direction: column;
  font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
  font-size: 11px;
  color: @text-color;
}

.toolbar {
  padding: 4px;
  background: linear-gradient(to bottom, #ece9d8 0%, #d4d0c8 100%);
  border-bottom: 1px solid @border-dark;
  border-top: 1px solid @border-light;
  border-left: 1px solid @border-light;
  border-right: 1px solid @border-dark;
  display: flex;
  align-items: center;
  gap: 4px;
}

.toolbar-button {
  padding: 4px 12px;
  background: @button-bg;
  border: 1px outset @button-bg;
  border-top-color: @border-light;
  border-left-color: @border-light;
  border-right-color: @border-dark;
  border-bottom-color: @border-dark;
  cursor: pointer;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
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

.content-area {
  flex: 1;
  padding: 8px;
  overflow: auto;
  background: @window-bg;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 16px;
}

.empty-icon {
  font-size: 64px;
  opacity: 0.5;
}

.empty-text {
  font-size: 12px;
  color: #666;
}

.icons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px, 1fr));
  gap: 16px;
  padding: 8px;
}

.deleted-icon-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  border: 1px solid transparent;
  border-radius: 2px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.1);
  }

  .icon-wrapper {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 4px;
    opacity: 0.7;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  .icon-label {
    font-size: 10px;
    text-align: center;
    margin: 4px 0;
    word-break: break-word;
    max-width: 100px;
    color: @text-color;
  }

  .icon-actions {
    margin-top: 4px;
  }

  .restore-button {
    padding: 2px 8px;
    background: @button-bg;
    border: 1px outset @button-bg;
    border-top-color: @border-light;
    border-left-color: @border-light;
    border-right-color: @border-dark;
    border-bottom-color: @border-dark;
    cursor: pointer;
    font-size: 10px;
    font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;

    &:hover {
      background: @button-hover;
    }

    &:active {
      border: 1px inset @button-bg;
      border-top-color: @border-dark;
      border-left-color: @border-dark;
      border-right-color: @border-light;
      border-bottom-color: @border-light;
    }
  }
}
</style>

