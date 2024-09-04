import { defineStore } from 'pinia';
import pinia from './piniaInstance';

const useSkillStore = defineStore('skillStore', {
    state: () => {
        return {
        }
    },
    actions: {
    }
});

export const skillStore = useSkillStore(pinia);