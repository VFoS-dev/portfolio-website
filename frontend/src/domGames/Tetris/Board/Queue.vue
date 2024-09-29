<template>
    <DisplayUI class="queue">
        <DisplayPiece v-for="(item,index) of props.items" :item="item.item" :style="{ '--color': item.color }" :key="index"/>
    </DisplayUI>
</template>

<script setup>
import DisplayPiece from './DisplayPiece.vue';
import DisplayUI from './DisplayUI.vue';

const props = defineProps({
    items: Array
})
</script>

<style lang="less" scoped>
.queue {
    min-height: calc(var(--size, 30px) * 10.5);
}
</style>