<template>
  <Resizable 
    ref="resizableRef" 
    :disabled="state.fullscreened" 
    :min-width="minWidth || 150"
    :min-height="minHeight || 150"
    :style="windowStyle"
    :classes="['window', { focused: state.focused, fullscreened: state.fullscreened, minimized: state.minimized }]"
    @mousedown="$emit('focus', index)">
    <div class="title-bar" v-bind="titleBarProps" @dblclick="$emit('maximize', index)">
      <div class="title-bar-text">
        <component :is="iconComponent" v-if="icon && iconComponent" :src="iconSrc" :class="['windowIcon', iconClass]" />
        <span class="title-text">{{ title }}</span>
      </div>
      <div class="title-bar-controls">
        <button v-for="control in ['minimize', 'maximize', 'close']" :id="`${control}-${index}`" :key="control"
          :class="control" :aria-label="control" @click="$emit(control, index)" />
      </div>
    </div>
    <div class="window-content">
      <App :app="props.app" :app-props="props.appProps" />
    </div>
  </Resizable>
</template>

<script setup>
import { computed, defineAsyncComponent, ref, provide } from 'vue';
import Resizable from './Resizable.vue';
import { dragParentElement } from '@/utilities/window';
import App from './App.vue';

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
  index: {
    type: Number,
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
});

defineEmits(['focus', 'minimize', 'maximize', 'close']);

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
  return dragParentElement(false, false);
}

const titleBarProps = getTitleBarProps();

const resizableRef = ref(null);

// Compute window style with custom width/height if provided
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
}

provide('setWindowSize', setWindowSize);
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

      &.minimize {
        background-image: url(/images/resume/minimize.svg);
      }

      &.maximize {
        background-image: url(/images/resume/maximize.svg);
      }

      &.close {
        background-image: url(/images/resume/close.svg);
      }
    }
  }
}
</style>
