<template>
  <div>
    <h2>Experience:</h2>
    <div v-if="flavored">
      <div
        v-for="(exp, expIndex) in flavoredExperience"
        :key="`flavored-${expIndex}`"
      >
        <p>
          <strong>{{ exp.title }}</strong>
        </p>
        <p>
          <em>{{ exp.dates }}</em>
        </p>
        <ul>
          <li
            v-for="(point, pointIndex) in exp.points"
            :key="`flavored-${expIndex}-${pointIndex}`"
          >
            {{ point }}
          </li>
        </ul>
      </div>
    </div>
    <div v-else>
      <div v-for="(exp, expIndex) in experience" :key="`exp-${expIndex}`">
        <p>
          <strong
            >{{ exp.title }}{{ exp.subTitle ? `, ${exp.subTitle}` : '' }} -
            {{ exp.company }}</strong
          >
        </p>
        <p>
          <em>{{ exp.dates }}</em>
        </p>
        <ul v-if="exp.keyPoints">
          <li
            v-for="(point, pointIndex) in exp.keyPoints.split('\t ').filter(p => p.trim())"
            :key="`${expIndex}-${pointIndex}`"
          >
            {{ point }}
          </li>
        </ul>
      </div>
    </div>
    <br />
    <h2>
      Projects:<button class="hyperlink" @click="changePage('projects')">Click Here</button>
    </h2>
    <br />
    <h2>
      Skills:<button class="hyperlink" @click="changePage('skills')">Click Here</button>
    </h2>
    <br />
    <h2>
      Contact Information:<button class="hyperlink" @click="changePage('socials')">
        Click Here
      </button>
    </h2>
    <p>Email: jonkido@vfos.dev</p>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

defineProps({
  flavored: {
    type: Boolean,
    default: false,
  },
  experience: {
    type: Array,
    required: true,
  },
  flavoredExperience: {
    type: Array,
    default: () => [],
  },
});

function changePage(page) {
  router.push({ name: page });
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

