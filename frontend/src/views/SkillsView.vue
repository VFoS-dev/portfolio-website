<template>
    new skills
    <div class="wrap">

        <Lightsaber />
    </div>
</template>

<script setup>
import Lightsaber from '@/components/Lightsaber.vue'
</script>

<style lang="less" scoped>
.wrap{
    display: flex;
    flex-direction: row;
    position: absolute;
    top: 25%;
    left: 25%;
    gap: 2rem;
}</style>

</style>