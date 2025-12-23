<template>
  <div class="projects">
    <div class="navpadding"></div>
    <div class="content">
      <!-- Projects content will go here -->
    </div>
  </div>
</template>

<script setup>
import { cubeStore } from '@/stores/cubeStore';
</script>

<style lang="less" scoped>
.projects {
  min-height: 100vh;
  width: 100%;
}

.navpadding {
  height: 80px;
}

.content {
  padding: 2rem;
}
</style>
