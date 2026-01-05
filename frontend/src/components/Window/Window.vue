<template>
  <Resizable ref="resizableRef" :disabled="state.fullscreened" :min-width="minWidth || 150"
    :min-height="minHeight || 150" :window-id="windowId" :style="windowStyle"
    :classes="['window', { focused: state.focused, fullscreened: state.fullscreened, minimized: state.minimized }]"
    @mousedown="windowStore.focusWindow(windowId)">
    <div class="title-bar" v-bind="titleBarProps"
      @dblclick="props.app !== 'Submittable' && handleControlClick('maximize')">
      <div class="title-bar-text">
        <component :is="iconComponent" v-if="icon && iconComponent" :src="iconSrc" :class="['windowIcon', iconClass]" />
        <span class="title-text">{{ title }}</span>
      </div>
      <div class="title-bar-controls">
        <button v-for="control in windowControls" :id="`${control}-${windowId}`" :key="control" :class="control"
          :aria-label="control" @click="handleControlClick(control, $event)" @touchend="handleControlClick(control, $event)" />
      </div>
    </div>
    <div class="window-content" @contextmenu.prevent="handleWindowContentContextMenu" @touchstart="handleWindowContentTouchStart" @touchend="handleWindowContentTouchEnd">
      <App :app="props.app" :app-props="props.appProps" />
    </div>
  </Resizable>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, provide } from 'vue';
import Resizable from './Resizable.vue';
import { dragParentElement } from '@/utilities/window';
import App from './App.vue';
import { useWindowStore } from '@/stores/windowStore';

const windowStore = useWindowStore();

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  icon: {
    type: [String, Object],
    default: null,
  },
  iconClass: {
    type: String,
    default: null,
  },
  state: {
    type: Object,
    required: true,
  },
  app: {
    type: String,
    required: true,
  },
  appProps: {
    type: Object,
    default: () => ({}),
  },
  windowId: {
    type: String,
    required: true,
  },
  minWidth: {
    type: Number,
    default: 150,
  },
  minHeight: {
    type: Number,
    default: 150,
  },
  width: {
    type: [String, Number],
    default: null,
  },
  height: {
    type: [String, Number],
    default: null,
  },
  left: {
    type: [String, Number],
    default: null,
  },
  top: {
    type: [String, Number],
    default: null,
  },
});


const iconComponent = computed(() => {
  if (!props.icon) return null;

  // If icon is a string path to an image, use img tag
  if (typeof props.icon === 'string' && (props.icon.startsWith('/') || props.icon.startsWith('http'))) {
    return 'img';
  }

  // If icon is a string component path, dynamically import it
  if (typeof props.icon === 'string') {
    try {
      return defineAsyncComponent({
        loader: () => import(`@/components/${props.icon}.vue`),
        errorComponent: null,
      });
    } catch {
      return null;
    }
  }

  // If icon is already a component, use it directly
  return props.icon;
});

const iconSrc = computed(() => {
  if (typeof props.icon === 'string' && (props.icon.startsWith('/') || props.icon.startsWith('http'))) {
    return props.icon;
  }
  return null;
});

function getTitleBarProps() {
  return dragParentElement(false, false, () => { }, '', (element) => {
    // On drag end, update store with current position and dimensions
    // Use requestAnimationFrame to ensure DOM has updated before reading position
    if (element && props.windowId) {
      requestAnimationFrame(() => {
        // Don't update if window is minimized (display: none causes getBoundingClientRect to return 0)
        const window = windowStore.windows[props.windowId];
        if (window?.state?.minimized || props.state.minimized) {
          return;
        }

        const rect = element.getBoundingClientRect();
        // Ensure we capture the actual computed position from the DOM
        const computedLeft = rect.left;
        const computedTop = rect.top;
        const computedWidth = rect.width;
        const computedHeight = rect.height;
        
        windowStore.updateWindow(props.windowId, {
          left: computedLeft,
          top: computedTop,
          width: computedWidth,
          height: computedHeight,
        });
        // Don't clear defaults - keep the values in the window object so they persist
      });
    }
  });
}

const titleBarProps = getTitleBarProps();

const resizableRef = ref(null);

// Determine which window controls to show based on app type
const windowControls = computed(() => {
  // Submittable windows should only have close button
  if (props.app === 'Submittable') {
    return ['close'];
  }
  // All other windows have minimize, maximize, and close
  return ['minimize', 'maximize', 'close'];
});

// Handle window control button clicks
function handleControlClick(control, e) {
  // Prevent default to avoid double-firing on mobile
  if (e) {
    e.preventDefault();
    e.stopPropagation();
  }
  
  if (control === 'minimize') {
    windowStore.minimizeWindow(props.windowId);
  } else if (control === 'maximize') {
    windowStore.maximizeWindow(props.windowId);
  } else if (control === 'close') {
    windowStore.closeWindow(props.windowId);
  }
}

// Long-press support for window content context menu on mobile
let touchStartTime = null;
let touchStartTimer = null;
let touchStartEvent = null;

function handleWindowContentTouchStart(e) {
  touchStartTime = Date.now();
  touchStartEvent = e;
  // Long press after 500ms
  touchStartTimer = setTimeout(() => {
    if (touchStartEvent) {
      handleWindowContentContextMenu(touchStartEvent);
    }
  }, 500);
}

function handleWindowContentTouchEnd(e) {
  // Clear timer if touch ends before long press
  if (touchStartTimer) {
    clearTimeout(touchStartTimer);
    touchStartTimer = null;
  }
  touchStartEvent = null;
}

function handleWindowContentContextMenu(e) {
  // Clear any pending touch timer
  if (touchStartTimer) {
    clearTimeout(touchStartTimer);
    touchStartTimer = null;
  }
  
  // Prevent default context menu
  if (e.preventDefault) {
    e.preventDefault();
  }
  
  // Get coordinates from touch or mouse event
  const clientX = e.touches?.[0]?.clientX || e.clientX;
  const clientY = e.touches?.[0]?.clientY || e.clientY;
  
  // Emit context menu event (window content apps can listen to this)
  // For now, we'll just prevent the default and let apps handle it if needed
  // You might want to emit a custom event here if apps need context menus
}

// Compute window style with custom width/height/left/top if provided
const windowStyle = computed(() => {
  const style = {};
  if (props.width !== null && props.width !== undefined) {
    const widthValue = typeof props.width === 'number' ? `${props.width}px` : props.width;
    style.width = widthValue;
    style['--custom-width'] = widthValue;
  }
  if (props.height !== null && props.height !== undefined) {
    const heightValue = typeof props.height === 'number' ? `${props.height}px` : props.height;
    style.height = heightValue;
    style['--custom-height'] = heightValue;
  }
  if (props.left !== null && props.left !== undefined) {
    const leftValue = typeof props.left === 'number' ? `${props.left}px` : props.left;
    style.left = leftValue;
  }
  if (props.top !== null && props.top !== undefined) {
    const topValue = typeof props.top === 'number' ? `${props.top}px` : props.top;
    style.top = topValue;
  }
  return Object.keys(style).length > 0 ? style : undefined;
});

// Provide a method to set window size from child components
function setWindowSize(width, height) {
  if (resizableRef.value) {
    // Access the Resizable component's exposed ref
    const resizableComponent = resizableRef.value;
    if (resizableComponent && resizableComponent.resizableRef) {
      const windowElement = resizableComponent.resizableRef.value;
      if (windowElement) {
        windowElement.style.width = `${width}px`;
        windowElement.style.height = `${height}px`;
        // Also update left/top to center if needed (optional)
        // const currentLeft = parseFloat(windowElement.style.left) || windowElement.getBoundingClientRect().left;
        // const currentTop = parseFloat(windowElement.style.top) || windowElement.getBoundingClientRect().top;
      }
    }
  }

  // Update the window store so the size persists across re-renders
  if (props.windowId) {
    windowStore.updateWindow(props.windowId, {
      width: width,
      height: height,
    });
  }
}

provide('setWindowSize', setWindowSize);
provide('windowId', props.windowId);
</script>

<style lang="less" scoped>
@title-bar-blue: #0050ee;
@title-bar-blue-dark: #0831d9;
@title-bar-blue-darker: #001ea0;
@title-bar-blue-gradient: linear-gradient(180deg,
    #0997ff,
    #0053ee 8%,
    #0050ee 40%,
    #06f 88%,
    #06f 93%,
    #005bff 95%,
    #003dd7 96%,
    #003dd7);
@window-bg: #ece9d8;
@icon-size: 20px;
@icon-size-small: 16px;
@taskbar-height: 28px;
@title-bar-height: 25px;
@window-min-size: 150px;
@border-radius: 8px;

.windowIcon {
  position: absolute;
  background-repeat: no-repeat;
  background-size: contain;
  width: @icon-size-small;
  height: @icon-size-small;
  margin: 2px;
  font-size: 30px !important;

  // If it's an img tag, ensure it displays correctly
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
}

.window {
  z-index: 0;
  overflow: hidden;
  box-shadow:
    inset -1px -1px #00138c,
    inset 1px 1px @title-bar-blue-dark,
    inset -2px -2px @title-bar-blue-darker,
    inset 2px 2px #166aee,
    inset -3px -3px #003bda,
    inset 3px 3px #0855dd;
  position: absolute;
  border-top-left-radius: @border-radius;
  border-top-right-radius: @border-radius;
  -webkit-font-smoothing: antialiased;
  min-width: @window-min-size;
  min-height: @window-min-size;
  height: var(--custom-height, 80vh);
  width: var(--custom-width, 90vw);
  left: 5vw;
  top: 10vh;
  font-size: 11px;
  background: @window-bg;
  
  // Mobile rendering fixes
  @media (max-width: 991px) {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-backface-visibility: hidden;
    backface-visibility: hidden;
    will-change: transform;
    // Ensure proper rendering on mobile
    -webkit-perspective: 1000;
    perspective: 1000;
  }

  &.minimized {
    display: none;
  }

  &.fullscreened {
    width: 100vw !important;
    height: calc(100dvh - @taskbar-height) !important;
    top: 0 !important;
    left: 0 !important;
  }

  &.focused {
    z-index: 1;
  }
}

.window-content {
  margin: 3px;
  margin-top: 0;
  height: calc(100% - @taskbar-height);
  overflow: auto;
  
  // Mobile rendering fixes
  @media (max-width: 991px) {
    -webkit-overflow-scrolling: touch;
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }

  &::-webkit-scrollbar {
    width: 17px;
    height: 17px;
  }

  &::-webkit-scrollbar-track {
    background: #ece9d8;
    border: 1px inset #ece9d8;
    box-shadow: inset 1px 1px 0 0 #ffffff, inset -1px -1px 0 0 #808080;
  }

  &::-webkit-scrollbar-thumb {
    background: linear-gradient(135deg, #f0f0f0 0%, #d4d0c8 50%, #c0c0c0 100%);
    border: 1px solid #808080;
    border-top-color: #ffffff;
    border-left-color: #ffffff;
    border-right-color: #424242;
    border-bottom-color: #424242;
    box-shadow:
      inset 0 1px 0 0 #ffffff,
      inset 1px 0 0 0 #ffffff,
      inset -1px -1px 0 0 #424242;

    &:hover {
      background: linear-gradient(135deg, #e8e8e8 0%, #c8c4bc 50%, #b0b0b0 100%);
    }

    &:active {
      background: linear-gradient(135deg, #c8c4bc 0%, #b0b0b0 50%, #a0a0a0 100%);
      box-shadow:
        inset 1px 1px 0 0 #424242,
        inset -1px -1px 0 0 #ffffff;
    }
  }

  &::-webkit-scrollbar-button {
    background: linear-gradient(135deg, #f0f0f0 0%, #d4d0c8 50%, #c0c0c0 100%);
    border: 1px solid #808080;
    border-top-color: #ffffff;
    border-left-color: #ffffff;
    border-right-color: #424242;
    border-bottom-color: #424242;
    box-shadow:
      inset 0 1px 0 0 #ffffff,
      inset 1px 0 0 0 #ffffff,
      inset -1px -1px 0 0 #424242;
    height: 17px;
    width: 17px;

    &:hover {
      background: linear-gradient(135deg, #e8e8e8 0%, #c8c4bc 50%, #b0b0b0 100%);
    }

    &:active {
      background: linear-gradient(135deg, #c8c4bc 0%, #b0b0b0 50%, #a0a0a0 100%);
      box-shadow:
        inset 1px 1px 0 0 #424242,
        inset -1px -1px 0 0 #ffffff;
    }

    // Arrow icons for Windows XP style (up arrow)
    &:vertical:decrement {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17' height='17'%3E%3Cpath fill='%23000000' d='M8.5 5.5L5 9h7z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
    }

    // Arrow icons for Windows XP style (down arrow)
    &:vertical:increment {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17' height='17'%3E%3Cpath fill='%23000000' d='M8.5 11.5L12 8H5z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
    }

    // Arrow icons for Windows XP style (left arrow)
    &:horizontal:decrement {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17' height='17'%3E%3Cpath fill='%23000000' d='M5.5 8.5L9 5v7z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
    }

    // Arrow icons for Windows XP style (right arrow)
    &:horizontal:increment {
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='17' height='17'%3E%3Cpath fill='%23000000' d='M11.5 8.5L8 12V5z'/%3E%3C/svg%3E");
      background-repeat: no-repeat;
      background-position: center;
    }
  }

  // Firefox scrollbar styling
  scrollbar-width: thin;
  scrollbar-color: #c0c0c0 #ece9d8;
}

.title-bar {
  padding: 2px;
  font-family: Trebuchet MS;
  background: @title-bar-blue-gradient;
  border-top: 1px solid @title-bar-blue-dark;
  border-left: 1px solid @title-bar-blue-dark;
  border-right: 1px solid @title-bar-blue-darker;
  border-top-left-radius: @border-radius;
  border-top-right-radius: 7px;
  font-size: 13px;
  text-shadow: 1px 1px #0f1089;
  height: @title-bar-height;
  display: flex;
  justify-content: space-between;
  align-items: center;
  user-select: none;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;

  &-text {
    pointer-events: none;
    font-weight: 700;
    color: white;
    text-indent: 25px;
    letter-spacing: 0;
    margin-right: 3px;
    padding-left: 3px;
    display: flex;
    align-items: center;
    flex: 1;
    min-width: 0;

    .title-text {
      text-overflow: ellipsis;
      white-space: nowrap;
      overflow: hidden;
      min-width: 0;
      flex: 1;
    }
  }

  &-controls {
    display: flex;

    button {
      min-width: 21px;
      min-height: 21px;
      margin-left: 2px;
      background-repeat: no-repeat;
      background-position: 50%;
      box-shadow: none;
      background-color: @title-bar-blue;
      border: none;
      cursor: pointer;
      touch-action: manipulation;
      -webkit-tap-highlight-color: transparent;

      &.minimize {
        background-image: url(/images/resume/minimize.svg);
      }

      &.maximize {
        background-image: url(/images/resume/maximize.svg);
      }

      &.close {
        background-image: url(/images/resume/close.svg);
      }
      
      // Mobile: make buttons larger and more touch-friendly
      @media (max-width: 991px) {
        min-width: clamp(28px, 7vw, 32px);
        min-height: clamp(28px, 7vh, 32px);
        margin-left: clamp(3px, 1vw, 4px);
        background-size: clamp(16px, 4vw, 18px);
      }
    }
  }
}
</style>
