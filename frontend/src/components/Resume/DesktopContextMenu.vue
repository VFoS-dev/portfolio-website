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

const emit = defineEmits(['close', 'background-changed', 'background-reset', 'navbar-toggled']);

const fileInput = ref(null);
const navbarHidden = computed(() => navStore.hide);

function handleChangeBackground() {
  fileInput.value?.click();
  emit('close');
}

function handleFileSelected(event) {
  const file = event.target.files?.[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const imageData = e.target.result;
      // Save to localStorage
      localStorage.setItem('desktopBackground', imageData);
      emit('background-changed', imageData);
    };
    reader.readAsDataURL(file);
  }
  // Reset input so same file can be selected again
  if (fileInput.value) {
    fileInput.value.value = '';
  }
}

function handleResetBackground() {
  localStorage.removeItem('desktopBackground');
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
