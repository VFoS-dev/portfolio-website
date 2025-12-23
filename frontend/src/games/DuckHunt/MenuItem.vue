<template>
  <div>
    <slot></slot>
  </div>
</template>

<style scoped>
div {
  background-color: black;
  font-family: VT323, latin;
  font-weight: normal;
  font-size: 1.5rem;
  color: white;
  padding: 0.125rem 0.25rem;
  position: absolute;
  line-height: 1rem;
  border: 2px solid #80d010;
  display: flex;
  flex-direction: column;
}
</style>
