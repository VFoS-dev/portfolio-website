<template>
  <div
    class="resume"
    :style="{ backgroundImage: 'url(/images/resume/windows_xp_background.webp)' }"
  >
    <div class="center-start windows-icon-offset">
      <ResumeDesktopIcon
        :icon-props="getIconProps(false)"
        label="Jon Kido Resume 20XX Rough Draft"
      />
      <ResumeDesktopIcon
        :icon-props="getIconProps(true)"
        label="Flavored Resume 20XX Rough Draft"
      />
    </div>
    <Window
      v-for="(window, i) in windows"
      :key="`windows-${window.key}`"
      :window-state="window"
      :index="i"
      :config="window.config"
      @focus="handleWindowFocus(i)"
      @minimize="handleWindowMinimize(i)"
      @maximize="handleWindowMaximize(i)"
      @close="handleWindowClose(i)"
    >
      <App
        app="Word"
        :appProps="getWindowContentProps(window)"
      />
    </Window>
    <ResumeTaskbar :windows="windows" @focus="(index) => handleWindowFocus(index)" />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ResumeDesktopIcon from '@/components/Resume/ResumeDesktopIcon.vue';
import Window from '@/components/Window/Window.vue';
import App from '@/components/Window/App.vue';
import ResumeTaskbar from '@/components/Resume/ResumeTaskbar.vue';
import { createKey, onDoubleClick, dragParentElement } from '@/utilities/window';

const defaultWindowConfig = {
  title: 'Jon Kido Resume 20XX Rough Draft - Microsoft Word',
  icon: '/images/resume/wordIcon.png',
  controls: {
    minimize: true,
    maximize: true,
    close: true,
  },
  contentPath: 'Resume/ResumeContent',
};

const windows = ref([
  {
    flavored: false,
    focused: true,
    minimized: false,
    fullscreened: false,
    key: createKey(),
    config: {
      ...defaultWindowConfig,
      contentPath: 'Resume/ResumeContent',
    },
  },
]);

function newWindow(flavored = false) {
  const keys = windows.value.map(function (w) {
    w.focused = false;
    return w.key;
  });
  windows.value.push({
    flavored,
    focused: true,
    minimized: false,
    fullscreened: false,
    key: createKey(keys),
    config: {
      ...defaultWindowConfig,
      contentPath: 'Resume/ResumeContent',
    },
  });
}

function getWindowContentProps(window) {
  return {
    flavored: window.flavored,
  };
}

function handleWindowFocus(index) {
  windows.value[index].minimized = false;
  windows.value = windows.value.map(function (w, i) {
    return { ...w, focused: i === index };
  });
}

function handleWindowMinimize(index) {
  windows.value[index].focused = false;
  windows.value[index].minimized = !windows.value[index].minimized;
}

function handleWindowMaximize(index) {
  windows.value[index].fullscreened = !windows.value[index].fullscreened;
}

function handleWindowClose(index) {
  windows.value.splice(index, 1);
}

function handleNewWindow(flavored) {
  newWindow(flavored);
}

function getIconProps(flavored) {
  return {
    ...onDoubleClick(handleNewWindow, [flavored]),
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
    justify-content: space-between;
    width: 150px;
    height: 80px;
    display: flex;
    transform: translate(-50%, -50%);
  }
}
</style>
