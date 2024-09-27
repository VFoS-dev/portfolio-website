<template>
    <Piece class="s2x2">
        <Block b1 />
        <Block b2 />
        <Block b3 />
        <Block b4 />
    </Piece>
</template>

<script setup>
import Block from './Block.vue';
import Piece from './Piece.vue';
</script>

<style scoped lang="less">
div {
    --color: rgb(247, 0, 255);
}
</style>