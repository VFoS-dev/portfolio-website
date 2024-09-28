<template>
    <div class="space">
        <Board />
    </div>
</template>

<script setup>
import Board from './Board/Board.vue';
</script>

<style scoped lang="less">
.space {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
}
</style>