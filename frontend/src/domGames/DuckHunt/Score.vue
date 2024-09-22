<template>
    <div>
        <span> {{ padScore }} </span>
        <span> SCORE </span>
    </div>
</template>

<script setup>
import { computed } from 'vue';

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
div {
    --margin: 1rem;
    background-color: black;
    font-family: VT323, latin;
    font-weight: normal;
    font-size: 1.5rem;
    color: white;
    padding: .125rem .25rem;
    position: absolute;
    right: var(--margin);
    bottom: var(--margin);
    line-height: 1rem;
    border: 2px solid #80d010;
    display: flex;
    flex-direction: column;

    :last-child {
        align-self: flex-end;
    }
}
</style>