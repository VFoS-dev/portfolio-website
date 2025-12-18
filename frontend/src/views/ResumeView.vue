<template>
  <div class="resume" :style="{ backgroundImage: 'url(/images/resume/windows_xp_background.webp)' }">
    <div class="center-start windows-icon-offset">
      <ResumeDesktopIcon
        v-for="(icon, i) in windowConfig.icons"
        :key="i"
        :icon-props="getIconProps(icon)"
        :icon="icon['desktop-icon']"
        :label="icon.title"
      />
    </div>
    <Window
      v-for="(window, i) in windows"
      :key="`windows-${window.key}`"
      :title="window.title"
      :icon="window.icon"
      :state="window.state"
      :app="window.app"
      :app-props="window.appProps"
      :index="i"
      @focus="handleWindowFocus(i)"
      @minimize="handleWindowMinimize(i)"
      @maximize="handleWindowMaximize(i)"
      @close="handleWindowClose(i)"
    />
    <ResumeTaskbar :windows="windows" @focus="(index) => handleWindowFocus(index)" @minimize="(index) => handleWindowMinimize(index)" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ResumeDesktopIcon from '@/components/Resume/ResumeDesktopIcon.vue';
import Window from '@/components/Window/Window.vue';
import ResumeTaskbar from '@/components/Resume/ResumeTaskbar.vue';
import { createKey, onDoubleClick, dragParentElement } from '@/utilities/window';
import windowConfig from '@/json/windowConfig.json';

const windows = ref([
  {
    ...windowConfig.defaultWindow,
    key: createKey(),
    state: {
      fullscreened: false,
      focused: true,
      minimized: false,
    },
  },
]);

function newWindow(windowConfig) {
  const keys = windows.value.map(function (w) {
    w.state.focused = false;
    return w.key;
  });
  windows.value.push({
    ...windowConfig,
    key: createKey(keys),
    state: {
      fullscreened: false,
      focused: true,
      minimized: false,
    },
  });
}

function handleWindowFocus(index) {
  windows.value[index].state.minimized = false;
  windows.value = windows.value.map(function (w, i) {
    return {
      ...w,
      state: {
        ...w.state,
        focused: i === index,
      },
    };
  });
}

function handleWindowMinimize(index) {
  windows.value[index].state.focused = false;
  windows.value[index].state.minimized = !windows.value[index].state.minimized;
}

function handleWindowMaximize(index) {
  windows.value[index].state.fullscreened = !windows.value[index].state.fullscreened;
}

function handleWindowClose(index) {
  windows.value.splice(index, 1);
}

function handleNewWindow(windowConfig) {
  newWindow(windowConfig);
}

function getIconProps(windowConfig) {
  return {
    ...onDoubleClick(handleNewWindow, [windowConfig]),
    ...dragParentElement(true, true),
  };
}
</script>

<style lang="less" scoped>
.resume {
  background-image: linear-gradient(lightblue, lightgreen);
  background-size: cover;
  background-position: 50%;
  overflow: hidden;
  padding: 0 !important;
  width: 100%;
  height: 100%;
  position: relative;
  transform-origin: center;
  transition: transform 0.25s ease-out;
}

.center-start {
  position: absolute;
  top: 50%;
  left: 50%;

  .start {
    width: 70px;
  }

  &.windows-icon-offset {
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
    height: 80px;
    display: flex;
    transform: translate(-50%, -50%);
  }
}
</style>
