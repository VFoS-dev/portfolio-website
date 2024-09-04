import { defineStore } from 'pinia';
import pinia from './piniaInstance';

const useAboutStore = defineStore('aboutStore', {
    state: () => {
        return {
        }
    },
    actions: {
    }
});

export const aboutStore = useAboutStore(pinia);