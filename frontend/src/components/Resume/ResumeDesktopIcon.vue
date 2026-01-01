<template>
  <div class="start">
    <div 
      class="windows-icon" 
      :class="{ 'trash-can': isTrash, 'selected': isSelected }"
      :data-is-trash="isTrash ? 'true' : undefined"
      :style="{ 
        position: 'absolute',
        left: initialX,
        top: initialY
      }" 
      v-bind="iconProps"
    >
      <img :src="icon" />
      <p>{{ label }}</p>
    </div>
  </div>
</template>

<script setup>
defineProps({
  iconProps: {
    type: Object,
    required: true,
  },
  icon: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  initialX: {
    type: String,
    default: '50px',
  },
  initialY: {
    type: String,
    default: '50px',
  },
  isTrash: {
    type: Boolean,
    default: false,
  },
  isSelected: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="less" scoped>
@icon-size-large: 54px;
@border-radius-small: 2px;
@black: black;
@white: white;

.windows-icon {
  border: solid #0000 1px;
  padding: 5px 5px 0;
  width: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  pointer-events: all;

  * {
    pointer-events: none;
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.6);
    border-radius: @border-radius-small;
    border: solid rgba(73, 73, 73, 0.353) 1px;
  }

  p {
    text-shadow: @black 2px 2px 2px;
    color: @white;
    align-self: baseline;
    font-size: 0.8rem;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 100%;
    margin: 0;
    text-align: center;
  }

  img {
    width: @icon-size-large;
    height: @icon-size-large;
  }

  &.trash-can {
    cursor: default;
  }

  &.trash-highlight {
    background-color: rgba(255, 255, 0, 0.4) !important;
    border: solid rgba(255, 255, 0, 0.8) 2px !important;
  }

  &.selected {
    background-color: rgba(0, 102, 204, 0.3) !important;
    border: 1px solid #0066cc !important;
    border-style: dashed !important;
  }
}
</style>

