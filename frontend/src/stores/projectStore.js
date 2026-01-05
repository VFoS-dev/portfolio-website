import { defineStore } from 'pinia';
import { getProjects } from '@/services/api-service';
import { useCubeStore } from './cubeStore';
import sides from '@/enums/sides';
import { shouldFetch } from '@/utilities/persistence';

const useProjectStore = defineStore('projectStore', {
  state: () => ({
    scroll: 0,
    lastFetched: 0,
    projects: [],
    filters: {
      company: null,
      rarity: null,
      type: null,
      search: '',
      showDeprecated: false,
    },
  }),
  getters: {
    getProjects(state) {
      // Fetch if data is stale OR if there are no projects loaded
      if (shouldFetch(state.lastFetched) || state.projects.length === 0) {
        // Use the action to fetch projects
        useProjectStore().fetchProjects();
      }
      return state.projects;
    },
    getFilteredProjects(state) {
      let filtered = [...state.projects];

      // Filter out deprecated projects unless showDeprecated is true
      if (!state.filters.showDeprecated) {
        filtered = filtered.filter(p => !p.deprecated);
      }

      // Filter by company
      if (state.filters.company) {
        filtered = filtered.filter(p => p.company?.name === state.filters.company);
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
    getCompanies(state) {
      const companies = new Set();
      state.projects.forEach(project => {
        if (project.company?.name) {
          companies.add(project.company.name);
        }
      });
      const companyList = Array.from(companies).sort().map(name => ({
        label: name,
        value: name,
      }));
      return [
        { label: 'All', value: null },
        ...companyList,
      ];
    },
    getRarities() {
      return [
        { label: 'All', value: null },
        { label: 'Common', value: 'common' },
        { label: 'Uncommon', value: 'uncommon' },
        { label: 'Rare', value: 'rare' },
        { label: 'Mythic', value: 'mythic' },
      ];
    },
    getHighestCardNumber(state) {
      if (state.projects.length === 0) return 0;
      return Math.max(...state.projects.map(p => p.cardNumber || 0));
    },
  },
  actions: {
    async fetchProjects() {
      try {
        const projects = await getProjects();
        this.projects = projects;
        this.lastFetched = new Date();
      } catch (error) {
        console.error('Failed to fetch projects:', error);
      }
    },
    setFilters(filters) {
      this.filters = { ...this.filters, ...filters };
    },
    clearFilters() {
      this.filters = {
        company: null,
        rarity: null,
        type: null,
        search: '',
        showDeprecated: false,
      };
    },
    updateScroll({ scroll, percent, mount }) {
      this.scroll = scroll;
      const cubeStore = useCubeStore();
      cubeStore.updateScroll(sides.projects, percent, mount);
    },
  },
});

export { useProjectStore };
