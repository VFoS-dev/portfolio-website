<template>
  <div ref="resizableRef" class="resizable" :class="computedClasses" v-bind="$attrs">
    <slot />
    <!-- Resize handles -->
    <div class="resize-handle-top" @mousedown.stop="startResize($event, 'top')"></div>
    <div class="resize-handle-bottom" @mousedown.stop="startResize($event, 'bottom')"></div>
    <div class="resize-handle-left" @mousedown.stop="startResize($event, 'left')"></div>
    <div class="resize-handle-right" @mousedown.stop="startResize($event, 'right')"></div>
    <div class="resize-handle-top-left" @mousedown.stop="startResize($event, 'top-left')"></div>
    <div class="resize-handle-top-right" @mousedown.stop="startResize($event, 'top-right')"></div>
    <div class="resize-handle-bottom-left" @mousedown.stop="startResize($event, 'bottom-left')"></div>
    <div class="resize-handle-bottom-right" @mousedown.stop="startResize($event, 'bottom-right')"></div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
  minWidth: {
    type: Number,
    default: 150,
  },
  minHeight: {
    type: Number,
    default: 150,
  },
  classes: {
    type: [String, Array, Object],
    default: () => ({}),
  },
});

const resizableRef = ref(null);

const computedClasses = computed(() => {
  if (Array.isArray(props.classes)) {
    return props.classes;
  }
  if (typeof props.classes === 'object') {
    return props.classes;
  }
  return props.classes;
});
let isResizing = false;
let resizeDirection = '';
let startX = 0;
let startY = 0;
let startWidth = 0;
let startHeight = 0;
let startLeft = 0;
let startTop = 0;

function startResize(e, direction) {
  if (props.disabled || !resizableRef.value) return;

  isResizing = true;
  resizeDirection = direction;
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

  let newWidth = startWidth;
  let newHeight = startHeight;
  let newLeft = startLeft;
  let newTop = startTop;

  // Handle horizontal resizing
  if (resizeDirection.includes('right')) {
    newWidth = Math.max(props.minWidth, startWidth + deltaX);
  } else if (resizeDirection.includes('left')) {
    newWidth = Math.max(props.minWidth, startWidth - deltaX);
    newLeft = startLeft + deltaX;
  }

  // Handle vertical resizing
  if (resizeDirection.includes('bottom')) {
    newHeight = Math.max(props.minHeight, startHeight + deltaY);
  } else if (resizeDirection.includes('top')) {
    newHeight = Math.max(props.minHeight, startHeight - deltaY);
    newTop = startTop + deltaY;
  }

  resizableRef.value.style.width = `${newWidth}px`;
  resizableRef.value.style.height = `${newHeight}px`;
  resizableRef.value.style.left = `${newLeft}px`;
  resizableRef.value.style.top = `${newTop}px`;
}

function stopResize() {
  isResizing = false;
  resizeDirection = '';
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
}

onBeforeUnmount(() => {
  document.removeEventListener('mousemove', handleResize);
  document.removeEventListener('mouseup', stopResize);
});
</script>

<style lang="less" scoped>
div[class|="resize-handle"] {
  position: absolute;
  background: transparent;
  z-index: 10;
}

.resize-handle {
  &-top {
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    cursor: ns-resize;
  }

  &-bottom {
    bottom: 0;
    left: 0;
    right: 0;
    height: 4px;
    cursor: ns-resize;
  }

  &-left {
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    cursor: ew-resize;
  }

  &-right {
    right: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    cursor: ew-resize;
  }

  &-top-left {
    top: 0;
    left: 0;
    width: 8px;
    height: 8px;
    cursor: nwse-resize;
  }

  &-top-right {
    top: 0;
    right: 0;
    width: 8px;
    height: 8px;
    cursor: nesw-resize;
  }

  &-bottom-left {
    bottom: 0;
    left: 0;
    width: 8px;
    height: 8px;
    cursor: nesw-resize;
  }

  &-bottom-right {
    bottom: 0;
    right: 0;
    width: 8px;
    height: 8px;
    cursor: nwse-resize;
  }
}
</style>
