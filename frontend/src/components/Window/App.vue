<template>
  <component :is="appComponent" v-bind="props.appProps" />
</template>

<script setup>
import { defineAsyncComponent, computed, h } from 'vue';
import Fragment from '@/components/Fragment.vue';
import XPLoading from './XPLoading.vue';

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
    loader: () => import(`@/applications/${props.app}.vue`).catch(() => {
      // If not found in applications, try games folder (with subfolder structure)
      return import(`@/games/${props.app}/${props.app}.vue`).catch(() => {
        // Fallback to root games file for games that don't use subfolders
        return import(`@/games/${props.app}.vue`);
      });
    }),
    errorComponent: Fragment,
    loadingComponent: () => h(XPLoading, { appName: props.app }),
  });
});
</script>

