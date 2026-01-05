<template>
  <div class="taskbar">
    <div class="start" @click="toggleStartMenu" @touchend="toggleStartMenu">
      <div class="windowIcon"></div>
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
import { useWindowConfigStore } from '@/stores/windowConfigStore';

const windowConfigStore = useWindowConfigStore();
import { useWindowStore } from '@/stores/windowStore';

const windowStore = useWindowStore();

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
  if (windowConfig.value?.defaultWindow && windowConfig.value.defaultWindow?.iconTitle) {
    const defaultIcon = windowConfig.value.icons.find(icon => icon.title === windowConfig.value.defaultWindow?.iconTitle);
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

function toggleStartMenu(e) {
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
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
  
  // Mobile responsive scaling
  @media (max-width: 991px) {
    height: clamp(24px, 6vh, 28px);
    border-top-width: clamp(2px, 0.5vw, 3px);
  }

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
    touch-action: manipulation;
    -webkit-tap-highlight-color: transparent;

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
    
    // Mobile responsive scaling
    @media (max-width: 991px) {
      width: clamp(60px, 15vw, 80px);
      font-size: clamp(0.7em, 2.5vw, 0.9em);
      padding: clamp(1px, 0.5vw, 2px);
      
      .windowIcon {
        width: clamp(16px, 4vw, 18px);
        height: clamp(16px, 4vw, 18px);
        margin: clamp(2px, 0.5vw, 3px);
      }
    }
  }

  .applications {
    display: flex;
    flex-grow: 1;
    overflow: hidden;
    
    // Mobile: allow horizontal scrolling if needed
    @media (max-width: 991px) {
      overflow-x: auto;
      overflow-y: hidden;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none; // Firefox
      -ms-overflow-style: none; // IE/Edge
      
      &::-webkit-scrollbar {
        display: none; // Chrome/Safari
      }
    }
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
    
    // Mobile responsive scaling
    @media (max-width: 991px) {
      width: clamp(80px, 20vw, 120px);
      font-size: clamp(9px, 2.5vw, 11px) !important;
      text-indent: clamp(20px, 5vw, 24px);
      margin-left: clamp(5px, 1.5vw, 8px);
      height: clamp(20px, 5vh, 25px);
      
      .txt {
        font-size: clamp(9px, 2.5vw, 11px);
      }
    }
    
    @media (max-width: 480px) {
      width: clamp(60px, 18vw, 100px);
      font-size: clamp(8px, 2vw, 10px) !important;
      text-indent: clamp(18px, 4.5vw, 22px);
      margin-left: clamp(3px, 1vw, 5px);
      
      .txt {
        font-size: clamp(8px, 2vw, 10px);
      }
    }
  }

  #time {
    font-size: 1em;
    margin: 0 10px;
    width: 75px;
    color: @white;
    display: flex;
    align-items: center;
    
    // Mobile responsive scaling
    @media (max-width: 991px) {
      font-size: clamp(0.7em, 2.5vw, 0.9em);
      margin: 0 clamp(5px, 1.5vw, 8px);
      width: clamp(50px, 12vw, 65px);
    }
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
  
  // Mobile responsive scaling
  @media (max-width: 991px) {
    width: clamp(16px, 4vw, 18px);
    height: clamp(16px, 4vw, 18px);
    margin: clamp(2px, 0.5vw, 3px);
  }
}
</style>

