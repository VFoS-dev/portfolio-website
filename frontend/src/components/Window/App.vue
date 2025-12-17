<template>
  <component :is="appComponent" v-bind="props.appProps" />
</template>

<script setup>
import { defineAsyncComponent, computed } from 'vue';
import Fragment from '@/components/Fragment.vue';

const props = defineProps({
  app: {
    type: String,
    required: true,
  },
  appProps: {
    type: Object,
    default: () => ({}),
  },
});

const appComponent = computed(() => {
  return defineAsyncComponent({
    loader: () => import(`@/applications/${props.app}.vue`),
    errorComponent: Fragment,
    loadingComponent: Fragment,
  });
});
</script>

