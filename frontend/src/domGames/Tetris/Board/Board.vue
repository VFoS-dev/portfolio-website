<template>
    <div class="game">
        <Hold :item="'o'" />
        <div class="board">
            <slot>
                <div>

                </div>
            </slot>
        </div>
        <Queue :items="['l', 'o', 's', 'i']" />
    </div>
</template>

<script setup>
import Hold from './Hold.vue';
import Queue from './Queue.vue';
</script>

<style lang="less" scoped>
.game {
    --size: 50px;
    display: flex;
    flex-direction: row;
    gap: .5rem;
    align-items: flex-start;
}
</style>