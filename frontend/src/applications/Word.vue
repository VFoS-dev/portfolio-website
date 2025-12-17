<template>
    <h1>Word</h1>
    {{ content }}
</template>

<script setup>
const props = defineProps({
    content: {
        type: String,
        default: 'Hi',
    },
});

</script>
