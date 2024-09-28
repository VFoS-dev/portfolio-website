<template>
    <DisplayUI>
        <DisplayPiece v-for="item of props.items" :item="item" />
    </DisplayUI>
</template>

<script setup>
import DisplayPiece from './DisplayPiece.vue';
import DisplayUI from './DisplayUI.vue';

const props = defineProps({
    items: Array
})
</script>