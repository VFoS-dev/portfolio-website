<template>
  <Piece class="s3x2">
    <Block b2 />
    <Block b3 />
    <Block b4 />
    <Block b5 />
  </Piece>
</template>

<script setup>
import Block from './Block.vue';
import Piece from './Piece.vue';
</script>

<style scoped lang="less">
div {
  --color: rgb(255, 230, 0);
}
</style>

