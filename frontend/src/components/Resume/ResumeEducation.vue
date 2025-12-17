<template>
  <div>
    <h2>Education:</h2>
    <p
      v-for="(edu, eduIndex) in education"
      :key="`${edu.school}-${eduIndex}`"
      class="tab"
    >
      {{ edu.school }}: {{ edu.years }} <br />Major:
      <span
        v-for="(major, majorIndex) in edu.majors"
        :key="`${edu.school}-${major.short}-${majorIndex}`"
      >
        <span v-if="majorIndex > 0">, </span><strong>{{ major.short }}</strong> ({{
          major.long
        }})
      </span>
      <br />Minors:
      <span
        v-for="(minor, minorIndex) in edu.minors"
        :key="`${edu.school}-${minor.short}-${minorIndex}`"
      >
        <span v-if="minorIndex > 0">, </span><strong>{{ minor.short }}</strong> ({{
          minor.long
        }})
      </span>
    </p>
  </div>
</template>

<script setup>
defineProps({
  education: {
    type: Array,
    required: true,
  },
});
</script>

<style lang="less" scoped>
.tab {
  padding-left: calc(1vw * var(--tabAmount, 1));
}
</style>

