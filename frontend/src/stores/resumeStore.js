import { defineStore } from 'pinia';
import pinia from './piniaInstance';

const useResumeStore = defineStore('resumeStore', {
    state: () => {
        return {
        }
    },
    actions: {
    }
});

export const resumeStore = useResumeStore(pinia);