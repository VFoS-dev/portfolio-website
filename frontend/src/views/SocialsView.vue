<template>
  <FruitNinja :active="cubeStore.state.socials" />
</template>

<script setup>
import FruitNinja from '@/domGames/FruitNinja/FruitNinja.vue';
import { cubeStore } from '@/stores/cubeStore';
</script>

<style lang="less" scoped></style>
