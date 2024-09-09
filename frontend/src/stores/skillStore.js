import { defineStore } from 'pinia';
import pinia from './piniaInstance';
import { getSkills, getColors } from '@/services/api-service';
import { randomIndex } from '@/utilities/arrays';


const useSkillStore = defineStore('skillStore', {
    state: () => {
        return {
            loading: true,
            skills: {},
            colors: [],
        }
    },
    actions: {
        async fetchData() {
            await Promise.all([this.apiSkills(), this.apiColors()])

            return {
                skills: this.skills,
                colors: this.colors,
            }
        },
        randomColor() {
            return randomIndex(this.colors) ?? {}
        },
        async apiSkills() {
            this.loading = true;
            const skills = await getSkills()

            const sGroups = {}
            const order = new Set()

            for (const { group, name, percent } of skills) {
                order.add(group)
                if (!sGroups[group]) {
                    sGroups[group] = []
                }

                sGroups[group].push({ name, percent })
            }

            this.skills = {}
            for (const group of [...order].sort()) {
                this.skills[group] = sGroups[group]
            }

            this.loading = false;

            return this.skills
        },
        async apiColors() {
            this.loading = true;

            this.colors = await getColors()

            this.loading = false;

            return this.colors
        }
    }
});

export const skillStore = useSkillStore(pinia);