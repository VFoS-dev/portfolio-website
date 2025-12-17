<template>
  <Piece class="s3x2">
    <Block b1 />
    <Block b2 />
    <Block b5 />
    <Block b6 />
  </Piece>
</template>

<script setup>
import Piece from './Piece.vue';
import Block from './Block.vue';
</script>

<style scoped lang="less">
div {
  --color: rgb(136, 255, 0);
}
</style>
