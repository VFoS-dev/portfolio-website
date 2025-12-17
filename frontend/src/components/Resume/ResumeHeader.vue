<template>
  <center>
    <h1>Want a polished resume?</h1>
    <h5>
      <button class="hyperlink" @click="openResume('complete')">Complete Resume</button>
      <button class="hyperlink" @click="openResume('gamedev')">Game Dev Resume</button>
      <button class="hyperlink" @click="openResume('full-stack')">Full Stack Resume</button>
    </h5>
    <br />
    <br />
    <h1>Want to create a custom resume?</h1>
    <h5>
      <button class="hyperlink" @click="createResume">Click Here</button>
    </h5>
  </center>
</template>

<script setup>
function createResume() {
  window.open('/resume?create=1', '_blank');
}

function openResume(subset = 'complete') {
  window.open(`/pdf/${subset}_resume_eye_friendly.pdf`, '_blank');
}
</script>

<style lang="less" scoped>
@blue: blue;
@darkblue: darkblue;

.hyperlink {
  background: none;
  border: none;
  color: @blue;
  text-decoration: underline;
  cursor: pointer;
  font-size: inherit;
  padding: 0;
  margin: 0 5px;

  &:hover {
    color: @darkblue;
  }
}
</style>

