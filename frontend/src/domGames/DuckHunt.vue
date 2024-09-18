<template>
    <div birds></div>
    <div grass></div>
</template>

<script setup>

</script>

<style scoped lang="less">
div[grass]{
    position: absolute;
    height: 90px;
    max-height: 10vh;
    background-color: aliceblue;
    width: 100vw;
    bottom: 0;
    z-index: 2;
    background: url(/images/about/grass.webp);
    background-repeat: repeat, no-repeat;
}
</style>