<template>
  <div ref="container" class="virtual-scroller" @scroll="handleScroll">
    <div class="virtual-content" :style="{ minHeight: `${totalHeight}px` }">
      <!-- Spacer for items above viewport -->
      <div :style="{ height: `${offsetTop}px` }" class="virtual-spacer"></div>
      
      <!-- Visible items -->
      <div
        v-for="item in visibleItems"
        :key="getItemKey(item.data, item.index)"
        :data-index="item.index"
        class="virtual-item"
        ref="itemRefs"
      >
        <slot :item="item.data" :index="item.index"></slot>
      </div>
      
      <!-- Spacer for items below viewport -->
      <div :style="{ height: `${offsetBottom}px` }" class="virtual-spacer"></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';

const props = defineProps({
  items: {
    type: Array,
    required: true,
  },
  itemHeight: {
    type: Number,
    default: null, // null means dynamic height
  },
  overscan: {
    type: Number,
    default: 2, // Number of items to render outside viewport
  },
  scrollTop: {
    type: Number,
    default: 0,
  },
  getItemKey: {
    type: Function,
    default: (item, index) => index,
  },
});

const emit = defineEmits(['scroll']);

const container = ref();
const itemRefs = ref([]);
const itemHeights = ref(new Map()); // Cache for dynamic heights
const scrollTop = ref(0);
const containerHeight = ref(0);
let resizeObserver = null;
let isRestoringScroll = false;
let measurementTimeout = null;

// Calculate which items should be visible
const visibleItems = computed(() => {
  if (!props.items || props.items.length === 0) return [];
  
  const start = Math.max(0, startIndex.value - props.overscan);
  const end = Math.min(props.items.length, endIndex.value + props.overscan);
  
  return props.items.slice(start, end).map((item, i) => ({
    data: item,
    index: start + i,
  }));
});

// Calculate start index based on scroll position
const startIndex = computed(() => {
  if (props.itemHeight) {
    // Fixed height - simple calculation
    return Math.max(0, Math.floor(scrollTop.value / props.itemHeight) - props.overscan);
  }
  
  // Dynamic height - need to sum up heights
  if (itemHeights.value.size === 0) {
    return 0; // No measurements yet, start from beginning
  }
  
  let accumulatedHeight = 0;
  for (let i = 0; i < props.items.length; i++) {
    const height = itemHeights.value.get(i) || estimateHeight();
    if (accumulatedHeight + height > scrollTop.value) {
      return Math.max(0, i - 1);
    }
    accumulatedHeight += height;
  }
  return Math.max(0, props.items.length - 1);
});

// Calculate end index based on scroll position and container height
const endIndex = computed(() => {
  if (props.itemHeight) {
    // Fixed height
    const visibleCount = Math.ceil(containerHeight.value / props.itemHeight);
    return Math.min(props.items.length, startIndex.value + visibleCount + props.overscan * 2);
  }
  
  // Dynamic height
  if (itemHeights.value.size === 0) {
    // Estimate based on container height
    const estimatedHeight = estimateHeight();
    const visibleCount = Math.ceil(containerHeight.value / estimatedHeight);
    return Math.min(props.items.length, startIndex.value + visibleCount + props.overscan * 2);
  }
  
  let accumulatedHeight = getOffsetTop(startIndex.value);
  let index = startIndex.value;
  
  while (index < props.items.length && accumulatedHeight < scrollTop.value + containerHeight.value + 500) {
    const height = itemHeights.value.get(index) || estimateHeight();
    accumulatedHeight += height;
    index++;
  }
  
  return Math.min(props.items.length, index);
});

// Calculate offset for items above viewport
const offsetTop = computed(() => {
  if (props.itemHeight) {
    return startIndex.value * props.itemHeight;
  }
  
  return getOffsetTop(startIndex.value);
});

// Calculate offset for items below viewport
const offsetBottom = computed(() => {
  if (props.itemHeight) {
    const remaining = props.items.length - endIndex.value;
    return Math.max(0, remaining * props.itemHeight);
  }
  
  const totalHeight = getTotalHeight();
  const visibleHeight = getOffsetTop(endIndex.value);
  return Math.max(0, totalHeight - visibleHeight);
});

// Calculate total height
const totalHeight = computed(() => {
  if (props.itemHeight) {
    return props.items.length * props.itemHeight;
  }
  return getTotalHeight();
});

// Helper to get offset top for a given index (dynamic height)
function getOffsetTop(index) {
  let offset = 0;
  for (let i = 0; i < index && i < props.items.length; i++) {
    offset += itemHeights.value.get(i) || estimateHeight();
  }
  return offset;
}

// Helper to get total height (dynamic height)
function getTotalHeight() {
  if (props.itemHeight) {
    return props.items.length * props.itemHeight;
  }
  
  let total = 0;
  for (let i = 0; i < props.items.length; i++) {
    total += itemHeights.value.get(i) || estimateHeight();
  }
  return total;
}

// Estimate height for items not yet measured
function estimateHeight() {
  // Use average of measured heights, or fallback
  if (itemHeights.value.size === 0) {
    return props.itemHeight || 300; // Default estimate
  }
  
  const heights = Array.from(itemHeights.value.values());
  const average = heights.reduce((a, b) => a + b, 0) / heights.length;
  return average;
}

// Measure item heights (for dynamic height mode)
function measureItems() {
  if (props.itemHeight || !container.value) return;
  
  // Clear any pending measurement
  if (measurementTimeout) {
    clearTimeout(measurementTimeout);
  }
  
  measurementTimeout = setTimeout(() => {
    nextTick(() => {
      const items = container.value.querySelectorAll('.virtual-item');
      let hasChanges = false;
      
      items.forEach((item) => {
        const index = parseInt(item.dataset.index);
        if (!isNaN(index) && index >= 0) {
          const height = item.offsetHeight || item.scrollHeight;
          const currentHeight = itemHeights.value.get(index);
          
          if (height > 0 && height !== currentHeight) {
            itemHeights.value.set(index, height);
            hasChanges = true;
          }
        }
      });
      
      // If heights changed, trigger recalculation
      if (hasChanges) {
        // Force update by touching scrollTop
        const currentScroll = container.value.scrollTop;
        if (currentScroll !== scrollTop.value) {
          scrollTop.value = currentScroll;
        }
      }
    });
  }, 50); // Debounce measurements
}

// Handle scroll events
function handleScroll(event) {
  if (isRestoringScroll) return;
  
  const target = event.target;
  const newScrollTop = target.scrollTop;
  scrollTop.value = newScrollTop;
  
  if (containerHeight.value === 0) {
    containerHeight.value = target.clientHeight;
  }
  
  // Measure items after scroll (for dynamic height)
  if (!props.itemHeight) {
    measureItems();
  }
  
  // Emit scroll event for parent
  const scrollHeight = target.scrollHeight;
  const viewportHeight = target.clientHeight;
  const percent = scrollHeight > viewportHeight
    ? Math.min(1, Math.max(0, newScrollTop / (scrollHeight - viewportHeight)))
    : 1;
  
  emit('scroll', {
    scroll: newScrollTop,
    percent,
    mount: false,
  });
}

// Watch for scrollTop prop changes (scroll restoration)
watch(
  () => props.scrollTop,
  (newScrollTop) => {
    if (container.value && Math.abs(container.value.scrollTop - newScrollTop) > 1) {
      isRestoringScroll = true;
      container.value.scrollTop = newScrollTop;
      scrollTop.value = newScrollTop;
      
      // Measure after scroll restoration
      if (!props.itemHeight) {
        nextTick(() => {
          setTimeout(() => {
            measureItems();
            isRestoringScroll = false;
          }, 100);
        });
      } else {
        nextTick(() => {
          setTimeout(() => {
            isRestoringScroll = false;
          }, 0);
        });
      }
    }
  },
  { immediate: false }
);

// Watch for items changes to remeasure
watch(
  () => props.items,
  () => {
    if (!props.itemHeight) {
      itemHeights.value.clear();
      nextTick(() => {
        measureItems();
      });
    }
  },
  { deep: false }
);

onMounted(() => {
  if (!container.value) return;
  
  // Get initial container height
  containerHeight.value = container.value.clientHeight || window.innerHeight;
  
  // Restore scroll position if provided
  if (props.scrollTop > 0) {
    isRestoringScroll = true;
    scrollTop.value = props.scrollTop;
    
    // Wait for DOM to be ready
    nextTick(() => {
      requestAnimationFrame(() => {
        if (container.value) {
          container.value.scrollTop = props.scrollTop;
          
          setTimeout(() => {
            if (!props.itemHeight) {
              measureItems();
            }
            isRestoringScroll = false;
          }, 150);
        }
      });
    });
  } else {
    // Initial measurement
    nextTick(() => {
      measureItems();
    });
  }
  
  // Use ResizeObserver to track container size changes
  if (typeof ResizeObserver !== 'undefined') {
    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const newHeight = entry.contentRect.height;
        if (newHeight > 0 && newHeight !== containerHeight.value) {
          containerHeight.value = newHeight;
        }
      }
    });
    resizeObserver.observe(container.value);
  }
  
  // Also listen to window resize for mobile
  window.addEventListener('resize', handleResize);
});

function handleResize() {
  if (container.value) {
    const newHeight = container.value.clientHeight;
    if (newHeight > 0) {
      containerHeight.value = newHeight;
    }
  }
}

onBeforeUnmount(() => {
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
  if (measurementTimeout) {
    clearTimeout(measurementTimeout);
  }
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="less" scoped>
.virtual-scroller {
  width: 100%;
  height: 100%;
  overflow: auto;
  position: relative;
  
  // Mobile optimizations
  -webkit-overflow-scrolling: touch;
  will-change: scroll-position;
  
  @media (max-width: 991px) {
    -webkit-transform: translateZ(0);
    transform: translateZ(0);
  }
}

.virtual-content {
  position: relative;
  width: 100%;
}

.virtual-spacer {
  width: 100%;
  flex-shrink: 0;
  pointer-events: none;
}

.virtual-item {
  width: 100%;
  flex-shrink: 0;
}
</style>
