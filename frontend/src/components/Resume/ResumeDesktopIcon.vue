<template>
  <div class="start">
    <div class="windows-icon" style="position: relative" v-bind="iconProps">
      <img src="/images/resume/wordicon_destop.svg" />
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
  label: {
    type: String,
    required: true,
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
  position: absolute;
  width: 70px;
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;

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
  }

  img {
    width: @icon-size-large;
    height: @icon-size-large;
  }
}
</style>

