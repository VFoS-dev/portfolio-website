<template>
    <Teleport :to="to" :disabled="disabled" :key="disabled">
        <slot></slot>
    </Teleport>
</template>

<script setup>
defineProps({
    to: String,
    disabled: Boolean,
})
</script>