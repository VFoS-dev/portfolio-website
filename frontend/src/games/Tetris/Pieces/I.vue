<template>
  <Piece class="s4x1">
    <Block b1 />
    <Block b2 />
    <Block b3 />
    <Block b4 />
  </Piece>
</template>

<script setup>
import Piece from './Piece.vue';
import Block from './Block.vue';
</script>

<style scoped lang="less">
div {
  --color: green;
}
</style>

