import { defineStore } from 'pinia';
import pinia from './piniaInstance';

const useHomeStore = defineStore('homeStore', {
  state: () => {
    return {};
  },
  actions: {},
});

export const homeStore = useHomeStore(pinia);
