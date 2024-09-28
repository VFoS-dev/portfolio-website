<template>
    <DisplayUI>
        <DisplayPiece :item="props.item" />
    </DisplayUI>
</template>

<script setup>
import DisplayUI from './DisplayUI.vue';
import DisplayPiece from './DisplayPiece.vue';

const props = defineProps({
    item: String
})

</script>
