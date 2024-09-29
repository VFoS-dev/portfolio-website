<template>
    <DisplayUI>
        <DisplayPiece :item="props.item" :style="{ '--color': props.color }" />
    </DisplayUI>
</template>

<script setup>
import DisplayUI from './DisplayUI.vue';
import DisplayPiece from './DisplayPiece.vue';

const props = defineProps({
    item: { type: String, default: '' },
    color: { type: String, default: 'green' }
})

</script>
