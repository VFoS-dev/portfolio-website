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
        category: null,
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

      // Filter by category
      if (state.filters.category) {
        filtered = filtered.filter(p => p.category === state.filters.category);
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
    getCategories() {
      return [
        { label: 'All', value: null },
        { label: 'Gen 1: Personal', value: 'personal' },
        { label: 'Gen 2: Matraex', value: 'matraex' },
        { label: 'Gen 3: GIMM Works', value: 'gimmworks' },
        { label: 'Gen 4: Games', value: 'games' },
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
        category: null,
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
