<template>
    <MenuItem class="score">
        <span> {{ padScore }} </span>
        <span> SCORE </span>
    </MenuItem>
</template>

<script setup>
import { computed } from 'vue';
import MenuItem from './MenuItem.vue';

const props = defineProps({
    score: [String, Number],
    pad: { type: Number, default: 6 }
})

const padScore = computed(() => {
    const str = props.score + '';
    if (str.length > 6) return str;
    const pad = new Array(props.pad - str.length).fill(0);

    return pad.join('') + str
})

</script>

<style scoped lang="less">
.score {
    --margin: 1rem;
    right: var(--margin);
    bottom: var(--margin);
    display: flex;
    flex-direction: column;

    :last-child {
        align-self: flex-end;
    }
}
</style>