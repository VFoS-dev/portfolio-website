<template>
  <div class="window-options">
    <div class="window-options-default" ></div>
  </div>
  <div class="window-body">
    <div class="window-page" v-bind="editableProps">
      <ResumeHeader />
      <br />
      <ResumeEducation :education="resumeData?.education || []" />
      <br />
      <ResumeExperienceAndLinks
        :flavored="flavored"
        :experience="resumeData?.experience || []"
        :flavored-experience="resumeData?.flavored?.experience || []"
      />
    </div>
  </div>
</template>

<script setup>
import ResumeHeader from './ResumeHeader.vue';
import ResumeEducation from './ResumeEducation.vue';
import ResumeExperienceAndLinks from './ResumeExperienceAndLinks.vue';
import { editableFocusRot } from '@/utilities/window';

defineProps({
  flavored: {
    type: Boolean,
    default: false,
  },
});

const resumeData = { education: [], experience: [], flavored: { experience: [] } };

function getEditableProps() {
  return editableFocusRot();
}

const editableProps = getEditableProps();
</script>

<style lang="less" scoped>
@black: black;
@white: white;
@window-body-bg: #afada1;
@scrollbar-track: #dddccd;
@scrollbar-thumb: #f1f0e7;
@scrollbar-border: #d4d4d4;
@gray-border: rgb(221, 221, 221);
@icon-size: 20px;

.window-options {
  margin: 5px;
  min-height: 80px;

  .window-options-default {
    background-image: url(/images/resume/options.jpg);
    background-repeat: no-repeat;
    min-height: 80px;
    background-size: auto 80px;
  }
}

.window-body {
  margin: 8px;
  background: @window-body-bg;
  border: @gray-border 3px inset;
  height: calc(100% - 125px);
  overflow: scroll;
  padding: 0 !important;
  scrollbar-color: @scrollbar-thumb @scrollbar-track !important;
  scrollbar-width: unset !important;

  ::-webkit-scrollbar {
    width: @icon-size;
    height: @icon-size;
    position: relative !important;
  }

  ::-webkit-scrollbar-track {
    box-shadow: none !important;
    background-color: transparent;
    background: @scrollbar-track;
  }

  ::-webkit-scrollbar-thumb {
    background-color: @scrollbar-thumb;
    border-radius: 0;
    border: outset 3px @scrollbar-border;
  }
}

.window-page {
  display: flex;
  flex-direction: column;
  outline: none;
  font-family: 'Times New Roman', Times, serif;
  margin: 30px auto;
  border: @black 2px solid;
  box-shadow: @black 5px 5px 0;
  padding: min(5%, 5rem);
  width: min(1000px, 95%);
  min-height: 1375px;
  background-color: @white;
  color: @black;
  -webkit-touch-callout: text;
  -webkit-user-select: text;
  user-select: text;

  h1,
  h2,
  p,
  li,
  strong,
  em {
    color: @black;
  }

  h1 {
    font-size: 2rem;
    margin: 0;
  }

  h2 {
    font-size: 2.25rem;
    margin: 0;
  }

  p {
    font-size: 1rem;
    margin: 0;
  }

  ul {
    margin-bottom: 0.5rem;
    padding-left: 2.25rem;
  }
}
</style>

