<template>
    <div class="wrap">
        <slot></slot>
    </div>
</template>

<style lang="less" scoped>
.wrap {
    padding: 4rem;
    padding-top: 141px;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100dvw;
    height: 100dvh;
    overflow: auto;

    &[display] {
        pointer-events: none;
        padding: 0;

        * {
            pointer-events: all;
        }
    }
}
</style>