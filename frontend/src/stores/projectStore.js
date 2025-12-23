import { defineStore } from 'pinia';
import pinia from './piniaInstance';
import projectsData from '@/json/projectsData.json';
import { cubeStore } from './cubeStore';
import sides from '@/enums/sides';

const useProjectStore = defineStore('projectStore', {
  state: () => {
    return {
      scroll: 0,
      projects: projectsData,
      filters: {
        company: null,
        rarity: null,
        type: null,
        search: '',
      },
    };
  },
  getters: {
    getProjects(state) {
      return state.projects;
    },
    getFilteredProjects(state) {
      let filtered = [...state.projects];

      // Filter by company
      if (state.filters.company) {
        filtered = filtered.filter(p => p.company === state.filters.company);
      }

      // Filter by rarity
      if (state.filters.rarity) {
        filtered = filtered.filter(p => p.rarity === state.filters.rarity);
      }

      // Filter by type (tech stack)
      if (state.filters.type) {
        filtered = filtered.filter(p =>
          p.stack.some(tech => tech.toLowerCase().includes(state.filters.type.toLowerCase()))
        );
      }

      // Filter by search query
      if (state.filters.search) {
        const searchLower = state.filters.search.toLowerCase();
        filtered = filtered.filter(p =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower) ||
          p.stack.some(tech => tech.toLowerCase().includes(searchLower))
        );
      }

      return filtered;
    },
    getAvailableTypes(state) {
      const types = new Set();
      state.projects.forEach(project => {
        project.stack.forEach(tech => types.add(tech));
      });
      return Array.from(types).sort();
    },
    getCompanies() {
      return [
        { label: 'All', value: null },
        { label: 'VFoS', value: 'VFoS' },
        { label: 'Matraex', value: 'matraex' },
        { label: 'GIMM Works', value: 'gimmworks' },
      ];
    },
    getRarities() {
      return [
        { label: 'All', value: null },
        { label: 'Common', value: 'common' },
        { label: 'Uncommon', value: 'uncommon' },
        { label: 'Rare', value: 'rare' },
        { label: 'Holo Rare', value: 'holo-rare' },
      ];
    },
  },
  actions: {
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },
    clearFilters() {
      this.filters = {
        company: null,
        rarity: null,
        type: null,
        search: '',
      };
    },
    updateScroll({ scroll, percent, mount }) {
      this.scroll = scroll;
      cubeStore.updateScroll(sides.projects, percent, mount);
    },
  },
});

export const projectStore = useProjectStore(pinia);
