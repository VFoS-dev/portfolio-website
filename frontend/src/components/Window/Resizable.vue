<template>
  <div ref="resizableRef" class="resizable" :class="classes" v-bind="$attrs">
    <slot />
    <div
      v-for="handle in handles"
      :id="handle"
      :key="handle"
      class="resize-handle"
      @mousedown.stop="(e) => startResize(e, e.target.id)"
    />
  </div>
</template>

<script setup>
import { ref, onBeforeUnmount } from 'vue';
import { useWindowStore } from '@/stores/windowStore';

const windowStore = useWindowStore();

const props = defineProps({
  disabled: { type: Boolean, default: false },
  minWidth: { type: Number, default: 150 },
  minHeight: { type: Number, default: 150 },
  classes: { type: [String, Array, Object], default: () => ({}) },
  windowId: { type: String, default: null },
});

const handles = ['top', 'bottom', 'left', 'right', 'top-left', 'top-right', 'bottom-left', 'bottom-right'];
const resizableRef = ref(null);

defineExpose({ resizableRef });

let isResizing = false;
let direction = '';
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let startLeft = 0;
let startTop = 0;

function startResize(e, handleId) {
  if (props.disabled || !resizableRef.value) return;

  isResizing = true;
  direction = handleId;
  startX = e.clientX;
  startY = e.clientY;

  const rect = resizableRef.value.getBoundingClientRect();
  startWidth = rect.width;
  startHeight = rect.height;
  startLeft = rect.left;
  startTop = rect.top;

  document.addEventListener('mousemove', handleResize);
  document.addEventListener('mouseup', stopResize);
  e.preventDefault();
}

function handleResize(e) {
  if (!isResizing || !resizableRef.value) return;

  const deltaX = e.clientX - startX;
  const deltaY = e.clientY - startY;
  const el = resizableRef.value;

  let width = startWidth;
  let height = startHeight;
  let left = startLeft;
  let top = startTop;

  if (direction.includes('right')) {
    width = Math.max(props.minWidth, startWidth + deltaX);
  } else if (direction.includes('left')) {
    width = Math.max(props.minWidth, startWidth - deltaX);
    left = startLeft + deltaX;
  }

  if (direction.includes('bottom')) {
    height = Math.max(props.minHeight, startHeight + deltaY);
  } else if (direction.includes('top')) {
    height = Math.max(props.minHeight, startHeight - deltaY);
    top = startTop + deltaY;
  }

  el.style.width = `${width}px`;
  el.style.height = `${height}px`;
  el.style.left = `${left}px`;
  el.style.top = `${top}px`;
}

function stopResize() {
  if (isResizing && resizableRef.value && props.windowId) {
    // Update store with final position and size
    // Use requestAnimationFrame to ensure DOM has updated before reading position
    requestAnimationFrame(() => {
      const el = resizableRef.value;
      if (el) {
        const rect = el.getBoundingClientRect();
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
      }
    });
  }
  
  isResizing = false;
  direction = '';
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
});
</script>

<style lang="less" scoped>
.resize-handle {
  position: absolute;
  background: transparent;
  z-index: 10;

  &#top {
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    cursor: ns-resize;
  }

  &#bottom {
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    cursor: ns-resize;
  }

  &#left {
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    cursor: ew-resize;
  }

  &#right {
    right: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    cursor: ew-resize;
  }

  &#top-left {
    top: 0;
    left: 0;
    width: 8px;
    height: 8px;
    cursor: nwse-resize;
  }

  &#top-right {
    top: 0;
    right: 0;
    width: 8px;
    height: 8px;
    cursor: nesw-resize;
  }

  &#bottom-left {
    bottom: 0;
    left: 0;
    width: 8px;
    height: 8px;
    cursor: nesw-resize;
  }

  &#bottom-right {
    bottom: 0;
    right: 0;
    width: 8px;
    height: 8px;
    cursor: nwse-resize;
  }
}
</style>
