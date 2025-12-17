<template>
  <Piece class="s3x2">
    <Block b3 />
    <Block b4 />
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
  --color: rgb(0, 255, 149);
}
</style>
