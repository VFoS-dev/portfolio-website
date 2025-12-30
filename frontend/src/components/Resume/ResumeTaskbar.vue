<template>
  <div class="taskbar">
    <div class="start" @click="toggleStartMenu">
      <div class="windowIcon" />
      start
    </div>
    <div class="applications">
      <div
        v-for="window in windows"
        :key="window.id"
        :class="['application', { focused: window.state?.focused }]"
        @click="handleClick(window)"
      >
        <component
          :is="getIconComponent(window.icon)"
          v-if="window.icon && getIconComponent(window.icon)"
          :src="getIconSrc(window.icon)"
          :class="['taskbar-icon', window.iconClass]"
        />
        <div class="txt">{{ window.title }}</div>
      </div>
    </div>
    <div id="time" ref="timeEle">{{ currentTime }}</div>
    <StartMenu 
      :is-open="startMenuOpen" 
      :menu-items="menuItems"
      @close="closeStartMenu"
      @open-app="$emit('open-app', $event)"
      @shutdown="$emit('shutdown')"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, defineAsyncComponent, computed } from 'vue';
import StartMenu from './StartMenu.vue';
import { windowConfigStore } from '@/stores/windowConfigStore';
import { windowStore } from '@/stores/windowStore';

const emit = defineEmits(['open-app', 'shutdown']);

// Use window store for windows, but filter out Submittable windows (dialogs)
const windows = computed(() => {
  return windowStore.getWindows.filter(window => window.app !== 'Submittable');
});

const startMenuOpen = ref(false);

const windowConfig = computed(() => windowConfigStore.getConfig || { icons: [], defaultWindow: {} });

const menuItems = computed(() => {
  // Create menu items: Word, Minesweeper, and Resume
  const items = [];
  
  // Add Microsoft Word (use first Word entry)
  const wordIcon = windowConfig.value.icons.find(icon => icon.app === 'Word');
  if (wordIcon) {
    items.push({
      title: 'Microsoft Word',
      icon: wordIcon.icon,
      app: 'Word',
      appProps: {},
    });
  }
  
  // Add Minesweeper
  const minesweeperIcon = windowConfig.value.icons.find(icon => icon.app === 'Minesweeper');
  if (minesweeperIcon) {
    items.push({
      title: 'Minesweeper',
      icon: minesweeperIcon.icon,
      app: 'Minesweeper',
      appProps: {},
    });
  }
  
  // Add Resume (use defaultWindow configuration)
  if (windowConfig.value.defaultWindow && windowConfig.value.defaultWindow.iconTitle) {
    const defaultIcon = windowConfig.value.icons.find(icon => icon.title === windowConfig.value.defaultWindow.iconTitle);
    if (defaultIcon) {
      items.push({
        title: defaultIcon.title, // Use the actual icon title (default window's name)
        icon: defaultIcon.icon,
        app: defaultIcon.app,
        appProps: defaultIcon.appProps || {},
        iconTitle: defaultIcon.title, // Store the actual icon title for opening
      });
    }
  }
  
  return items;
});

function toggleStartMenu() {
  startMenuOpen.value = !startMenuOpen.value;
}

function closeStartMenu() {
  startMenuOpen.value = false;
}

const currentTime = ref('');
const timeEle = ref(null);
let timeInterval = null;

function getTime() {
  return new Date().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}

function updateTime() {
  currentTime.value = getTime();
}

function handleClick(window) {
  if (window.state?.focused) {
    windowStore.minimizeWindow(window.id);
  } else {
    windowStore.focusWindow(window.id);
  }
}

function getIconComponent(icon) {
  if (!icon) return null;
  
  // If icon is a string path to an image, use img tag
  if (typeof icon === 'string' && (icon.startsWith('/') || icon.startsWith('http'))) {
    return 'img';
  }
  
  // If icon is a string component path, dynamically import it
  if (typeof icon === 'string') {
    try {
      return defineAsyncComponent({
        loader: () => import(`@/components/${icon}.vue`),
        errorComponent: null,
      });
    } catch {
      return null;
    }
  }
  
  // If icon is already a component, use it directly
  return icon;
}

function getIconSrc(icon) {
  if (typeof icon === 'string' && (icon.startsWith('/') || icon.startsWith('http'))) {
    return icon;
  }
  return null;
}

onMounted(() => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);
});

onBeforeUnmount(() => {
  if (timeInterval) clearInterval(timeInterval);
});
</script>

<style lang="less" scoped>
@white: white;
@taskbar-blue: #265fdb;
@taskbar-blue-light: #578cfd;
@taskbar-blue-light-alpha: #578cfdad;
@taskbar-blue-dark: #2d51c7;
@start-green: #52be27;
@start-green-dark: #2f6b07;
@start-green-light: #a6db96;
@icon-size: 20px;
@taskbar-height: 30px;
@border-radius-tiny: 3px;

.taskbar {
  z-index: 2;
  pointer-events: none;
  background-color: @taskbar-blue;
  border-top: @taskbar-blue-light-alpha 3px solid;
  box-shadow: inset 0 7px 19px -7px @taskbar-blue-light;
  width: 100vw;
  position: absolute;
  bottom: 0;
  height: @taskbar-height;
  display: flex;

  .start {
    pointer-events: all;
    background-color: @start-green;
    width: 90px;
    text-align: center;
    color: @white;
    height: @taskbar-height;
    padding: 2px;
    font-size: 1em;
    border-bottom-right-radius: 10px;
    border-top-right-radius: 10px;
    box-shadow:
      inset 0 0 19px 0 @start-green-dark,
      inset @start-green-light 0 7px 19px -7px;
    transform: translateY(-3px);
    position: relative;
    cursor: pointer;

    .windowIcon {
      position: absolute;
      background-repeat: no-repeat;
      background-size: contain;
      width: @icon-size;
      height: @icon-size;
      margin: 3px;
      font-size: 30px !important;
      background-image: url(/images/resume/xpIcon.png);
    }
  }

  .applications {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
  }

  .application {
    pointer-events: all;
    border-radius: @border-radius-tiny;
    top: 0;
    left: 90px;
    width: 150px;
    box-shadow: inset rgba(0, 0, 0, 0.2) 0 0 5px;
    height: 25px;
    color: @white;
    margin-left: 10px;
    text-indent: 27px;
    font-size: 13px !important;
    cursor: pointer;
    display: flex;
    align-items: center;

    &.focused {
      background-color: @taskbar-blue-dark;
    }

    .txt {
      transform: translateY(2px);
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
    }
  }

  #time {
    font-size: 1em;
    margin: 0 10px;
    width: 75px;
    color: @white;
    display: flex;
    align-items: center;
  }
}

.taskbar-icon {
  position: absolute;
  background-repeat: no-repeat;
  background-size: contain;
  width: @icon-size;
  height: @icon-size;
  margin: 3px;
  font-size: 30px !important;

  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}
</style>

