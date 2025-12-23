<template>
  <Tetris :active="cubeStore.state.projects">
    <div>cool</div>
  </Tetris>
</template>

<script setup>
import Tetris from '@/applications/Tetris.vue';
import { cubeStore } from '@/stores/cubeStore';
</script>

<style lang="less" scoped></style>
