<template>
    <p v-for="({ str, attr }) of paragraphs" v-bind="attr">{{ str }}</p>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
    string: { type: String, default: '' }
})

const paragraphs = computed(() => {
    return props.string.split('\n').map(s => {
        let attr = {};
        const [str, hasId] = s.split(/#.+$/);
        if (hasId !== undefined) attr.id = s.split(str)[1]?.substring(1);

        const [, hasTab] = str.split(/^\t/);
        if (hasTab) attr.class = 'tab';

        return { str, attr }
    });
})
</script>