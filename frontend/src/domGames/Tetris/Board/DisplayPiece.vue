<template>
    <Piece />
</template>

<script setup>
import Fragment from '@/components/Fragment.vue';
import { capitalize, defineAsyncComponent, watch } from 'vue';

const props = defineProps({
    item: String
})

let Piece = defineAsyncComponent({
    loader: () => import(`../Pieces/${capitalize(props.item)}.vue`),
    errorComponent: Fragment
})

watch(() => props.item, () => {
    Piece = defineAsyncComponent({
        loader: () => import(`../Pieces/${capitalize(props.item)}.vue`),
        errorComponent: Fragment
    })
})
</script>
