import { defineStore } from 'pinia';
import pinia from './piniaInstance';

const useProjectStore = defineStore('projectStore', {
  state: () => {
    return {};
  },
  actions: {},
});

export const projectStore = useProjectStore(pinia);
