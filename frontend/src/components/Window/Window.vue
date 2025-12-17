<template>
  <Resizable
    :disabled="state.fullscreened"
    :min-width="minWidth || 150"
    :min-height="minHeight || 150"
    :classes="['window', { focused: state.focused, fullscreened: state.fullscreened, minimized: state.minimized }]"
    @mousedown="$emit('focus', index)"
  >
    <div class="title-bar" v-bind="titleBarProps">
      <div class="title-bar-text">
        <component
          :is="iconComponent"
          v-if="icon && iconComponent"
          :src="iconSrc"
          :class="['windowIcon', iconClass]"
        />
        <span class="title-text">{{ title }}</span>
      </div>
      <div class="title-bar-controls">
        <button
          v-for="control in ['minimize', 'maximize', 'close']"
          :id="`${control}-${index}`"
          :key="control"
          :class="control"
          :aria-label="control"
          @click="$emit(control, index)"
        />
      </div>
    </div>
    <App :app="app" :app-props="appProps" />
  </Resizable>
</template>

<script setup>
import { computed, defineAsyncComponent } from 'vue';
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
@taskbar-height: 30px;
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
  height: 80vh;
  width: 90vw;
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
