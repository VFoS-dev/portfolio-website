<template>
  <div 
    v-if="visible"
    class="context-menu"
    :style="{ left: `${x}px`, top: `${y}px` }"
    @click.stop
  >
    <div class="menu-item" @click="handleChangeBackground">
      <span>Change Background</span>
    </div>
    <div class="menu-item" @click="handleResetBackground">
      <span>Reset Background</span>
    </div>
    <div class="menu-item" @click="handleToggleNavbar">
      <span>{{ navbarHidden ? 'Show' : 'Hide' }} Navbar</span>
    </div>
    <div class="menu-item" @click="handleResetAll">
      <span>Reset All</span>
    </div>
    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      style="display: none"
      @change="handleFileSelected"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { navStore } from '@/stores/navStore';
import { cubeStore } from '@/stores/cubeStore';

const props = defineProps({
  visible: {
    type: Boolean,
    default: false,
  },
  x: {
    type: Number,
    default: 0,
  },
  y: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['close', 'background-changed', 'background-reset', 'navbar-toggled', 'reset-all']);

const fileInput = ref(null);
const navbarHidden = computed(() => navStore.hide);

function handleChangeBackground() {
  fileInput.value?.click();
  emit('close');
}

function handleFileSelected(event) {
  const file = event.target.files?.[0];
  if (!file) {
    // Reset input so same file can be selected again
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    return;
  }

  // Check file size (5MB limit for base64 encoded images in localStorage)
  // Base64 encoding increases size by ~33%, so we check the original file size
  const MAX_FILE_SIZE = 3 * 1024 * 1024; // 3MB (will be ~4MB when base64 encoded)
  if (file.size > MAX_FILE_SIZE) {
    alert(`Image is too large. Maximum file size is ${(MAX_FILE_SIZE / 1024 / 1024).toFixed(1)}MB. Please select a smaller image.`);
    // Reset input so same file can be selected again
    if (fileInput.value) {
      fileInput.value.value = '';
    }
    return;
  }

  // Check image dimensions to prevent extremely large images
  const img = new Image();
  const objectUrl = URL.createObjectURL(file);
  
  img.onload = () => {
    URL.revokeObjectURL(objectUrl);
    
    // Limit dimensions to prevent memory issues (e.g., 4K resolution max)
    const MAX_WIDTH = 3840;
    const MAX_HEIGHT = 2160;
    
    if (img.width > MAX_WIDTH || img.height > MAX_HEIGHT) {
      alert(`Image dimensions are too large. Maximum dimensions are ${MAX_WIDTH}x${MAX_HEIGHT} pixels. Please select a smaller image.`);
      // Reset input so same file can be selected again
      if (fileInput.value) {
        fileInput.value.value = '';
      }
      return;
    }
    
    // If dimensions are OK, proceed with reading the file
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      // Check the base64 data size (localStorage limit is typically 5-10MB)
      const MAX_DATA_SIZE = 4 * 1024 * 1024; // 4MB for base64 data
      if (imageData.length > MAX_DATA_SIZE) {
        alert('Image is too large to save. Please select a smaller image.');
        // Reset input so same file can be selected again
        if (fileInput.value) {
          fileInput.value.value = '';
        }
        return;
      }
      
      // Save to localStorage
      try {
        localStorage.setItem('r_desktopBackground', imageData);
        emit('background-changed', imageData);
      } catch (error) {
        // localStorage quota exceeded
        alert('Image is too large to save. Please select a smaller image.');
      }
    };
    reader.onerror = () => {
      alert('Error reading image file. Please try again.');
      // Reset input so same file can be selected again
      if (fileInput.value) {
        fileInput.value.value = '';
      }
    };
    reader.readAsDataURL(file);
  };
  
  img.onerror = () => {
    URL.revokeObjectURL(objectUrl);
    alert('Invalid image file. Please select a valid image.');
    // Reset input so same file can be selected again
    if (fileInput.value) {
      fileInput.value.value = '';
    }
  };
  
  img.src = objectUrl;
}

function handleResetBackground() {
  localStorage.removeItem('r_desktopBackground');
  emit('background-reset');
  emit('close');
}

function handleToggleNavbar() {
  const willBeHidden = !navStore.hide;
  navStore.toggleHide();
  // Disable cube rotation when navbar is hidden
  cubeStore.toggleKeyRotate(!willBeHidden);
  emit('navbar-toggled');
  emit('close');
}

function handleResetAll() {
  if (confirm('Are you sure you want to reset all? This will:\n- Remove all modified files\n- Delete all custom saved icons\n- Clear the trash\n- Reset the desktop background\n\nThis action cannot be undone.')) {
    emit('reset-all');
    emit('close');
  }
}
</script>

<style lang="less" scoped>
@menu-bg: #ece9d8;
@menu-border-light: #ffffff;
@menu-border-dark: #808080;
@menu-hover-bg: #316ac5;
@menu-hover-text: #ffffff;
@menu-text: #000000;

.context-menu {
  position: absolute;
  background: @menu-bg;
  border: 1px solid @menu-border-dark;
  border-top: 1px solid @menu-border-light;
  border-left: 1px solid @menu-border-light;
  box-shadow: 
    inset 1px 1px 0 0 @menu-border-light,
    inset -1px -1px 0 0 @menu-border-dark;
  padding: 2px;
  z-index: 1000;
  min-width: 180px;
  font-family: 'MS Sans Serif', 'Segoe UI', sans-serif;
  font-size: 11px;
  user-select: none;
}

.menu-item {
  padding: 4px 20px 4px 24px;
  color: @menu-text;
  cursor: pointer;
  position: relative;
  
  &:hover {
    background: @menu-hover-bg;
    color: @menu-hover-text;
  }
  
  &:active {
    background: darken(@menu-hover-bg, 10%);
  }
}
</style>
