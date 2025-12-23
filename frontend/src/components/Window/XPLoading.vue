<template>
  <div class="xp-loading">
    <div class="loading-container">
      <div class="progress-bar-container">
        <div class="progress-bar">
          <div class="progress-bar-fill"></div>
        </div>
      </div>
      <div class="loading-text">Loading {{ appName || '...' }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  appName: {
    type: String,
    default: '',
  },
});
</script>

<style lang="less" scoped>
@window-bg: #ece9d8;
@progress-bg: #f0f0f0;
@progress-border-light: #ffffff;
@progress-border-dark: #808080;
@progress-blue-start: #4a9eff;
@progress-blue-mid: #1e88e5;
@progress-blue-end: #0050ee;
@progress-shadow: rgba(0, 0, 0, 0.2);

.xp-loading {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  min-height: 200px;
  background: @window-bg;
  padding: 20px;
  box-sizing: border-box;
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  width: 100%;
  max-width: 300px;
}

.progress-bar-container {
  width: 100%;
  padding: 4px;
  background: @progress-bg;
  border: 2px inset @progress-bg;
  box-shadow:
    inset 1px 1px 0 0 @progress-border-dark,
    inset -1px -1px 0 0 @progress-border-light;
}

.progress-bar {
  position: relative;
  width: 100%;
  height: 18px;
  background: @progress-bg;
  border: 1px solid @progress-border-dark;
  overflow: hidden;
  box-shadow:
    inset 1px 1px 0 0 @progress-border-dark,
    inset -1px -1px 0 0 @progress-border-light;
}

.progress-bar-fill {
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 30%;
  background: linear-gradient(
    90deg,
    @progress-blue-start 0%,
    @progress-blue-mid 50%,
    @progress-blue-end 100%
  );
  background-size: 200% 100%;
  animation: xp-progress 1.5s ease-in-out infinite;
  box-shadow:
    0 0 8px @progress-shadow,
    inset 0 1px 0 0 rgba(255, 255, 255, 0.3),
    inset 0 -1px 0 0 rgba(0, 0, 0, 0.2);
  border-right: 1px solid rgba(255, 255, 255, 0.3);
}

@keyframes xp-progress {
  0% {
    left: -30%;
    width: 30%;
  }
  50% {
    left: 100%;
    width: 30%;
  }
  100% {
    left: -30%;
    width: 30%;
  }
}

.loading-text {
  font-family: 'Trebuchet MS', Tahoma, sans-serif;
  font-size: 11px;
  color: #000000;
  text-align: center;
  user-select: none;
}
</style>

