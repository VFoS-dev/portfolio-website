<template>
  <div class="collection-filters">
    <div class="filter-group">
      <label class="filter-label">Generation:</label>
      <div class="filter-buttons">
        <button
          v-for="category in categories"
          :key="category.value"
          :class="['filter-button', { active: selectedCategory === category.value }]"
          @click="updateCategory(category.value)"
        >
          {{ category.label }}
        </button>
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-label">Rarity:</label>
      <div class="filter-buttons">
        <button
          v-for="rarity in rarities"
          :key="rarity.value"
          :class="['filter-button', `rarity-${rarity.value}`, { active: selectedRarity === rarity.value }]"
          @click="updateRarity(rarity.value)"
        >
          {{ rarity.label }}
        </button>
      </div>
    </div>

    <div class="filter-group">
      <label class="filter-label">Type:</label>
      <div class="filter-buttons">
        <button
          :class="['filter-button', { active: selectedType === null }]"
          @click="updateType(null)"
        >
          All
        </button>
        <button
          v-for="type in availableTypes"
          :key="type"
          :class="['filter-button', 'type-button', { active: selectedType === type }]"
          @click="updateType(type)"
        >
          {{ type }}
        </button>
      </div>
    </div>

    <div class="filter-group">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search projects..."
        class="search-input"
        @input="handleSearch"
      />
    </div>

    <button v-if="hasActiveFilters" class="clear-filters" @click="clearFilters">
      Clear Filters
    </button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => [
      { label: 'All', value: null },
      { label: 'Gen 1: Personal', value: 'personal' },
      { label: 'Gen 2: Matraex', value: 'matraex' },
      { label: 'Gen 3: GIMM Works', value: 'gimmworks' },
      { label: 'Gen 4: Games', value: 'games' },
    ],
  },
  rarities: {
    type: Array,
    default: () => [
      { label: 'All', value: null },
      { label: 'Common', value: 'common' },
      { label: 'Uncommon', value: 'uncommon' },
      { label: 'Rare', value: 'rare' },
      { label: 'Holo Rare', value: 'holo-rare' },
    ],
  },
  availableTypes: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['filter']);

const selectedCategory = ref(null);
const selectedRarity = ref(null);
const selectedType = ref(null);
const searchQuery = ref('');

const hasActiveFilters = computed(() => {
  return selectedCategory.value !== null || selectedRarity.value !== null || selectedType.value !== null || searchQuery.value !== '';
});

function updateCategory(category) {
  selectedCategory.value = category;
  emitFilter();
}

function updateRarity(rarity) {
  selectedRarity.value = rarity;
  emitFilter();
}

function updateType(type) {
  selectedType.value = type;
  emitFilter();
}

function handleSearch() {
  emitFilter();
}

function clearFilters() {
  selectedCategory.value = null;
  selectedRarity.value = null;
  selectedType.value = null;
  searchQuery.value = '';
  emitFilter();
}

function emitFilter() {
  emit('filter', {
    company: selectedCategory.value,
    rarity: selectedRarity.value,
    type: selectedType.value,
    search: searchQuery.value.toLowerCase(),
  });
}
</script>

<style lang="less" scoped>
.collection-filters {
  background: rgba(255, 255, 255, 0.95);
  padding: 1.5rem;
  border-radius: 12px;
  margin-bottom: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  flex: 1;
  min-width: 200px;
}

.filter-label {
  font-weight: bold;
  font-size: 0.9rem;
  color: #333;
  margin-bottom: 0.25rem;
}

.filter-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.filter-button {
  padding: 0.5rem 1rem;
  border: 2px solid #ddd;
  background: white;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
  color: #333;

  &:hover {
    border-color: #999;
    transform: translateY(-2px);
  }

  &.active {
    background: #2196f3;
    color: white;
    border-color: #2196f3;
    box-shadow: 0 2px 4px rgba(33, 150, 243, 0.3);
  }

  &.rarity-common.active {
    background: #9b9b9b;
    border-color: #9b9b9b;
  }

  &.rarity-uncommon.active {
    background: #4caf50;
    border-color: #4caf50;
  }

  &.rarity-rare.active {
    background: #2196f3;
    border-color: #2196f3;
  }

  &.rarity-holo-rare.active {
    background: #9c27b0;
    border-color: #9c27b0;
    box-shadow: 0 2px 8px rgba(156, 39, 176, 0.4);
  }
}

.type-button {
  font-size: 0.75rem;
  padding: 0.4rem 0.8rem;
}

.search-input {
  padding: 0.5rem 1rem;
  border: 2px solid #ddd;
  border-radius: 20px;
  font-size: 0.9rem;
  width: 100%;
  transition: border-color 0.2s;

  &:focus {
    outline: none;
    border-color: #2196f3;
  }
}

.clear-filters {
  padding: 0.5rem 1rem;
  background: #f44336;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
  align-self: flex-end;

  &:hover {
    background: #d32f2f;
    transform: translateY(-2px);
    box-shadow: 0 2px 4px rgba(244, 67, 54, 0.3);
  }
}

@media (max-width: 768px) {
  .collection-filters {
    flex-direction: column;
    align-items: stretch;
  }

  .filter-group {
    min-width: 100%;
  }
}
</style>

