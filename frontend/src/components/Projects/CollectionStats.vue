<template>
  <div class="collection-stats">
    <div class="stat-item">
      <span class="stat-label">Total Cards:</span>
      <span class="stat-value">{{ totalCards }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">Showing:</span>
      <span class="stat-value">{{ filteredCount }}</span>
    </div>
    <div class="stat-item">
      <span class="stat-label">By Rarity:</span>
      <div class="rarity-stats">
        <span
          v-for="(count, rarity) in rarityCounts"
          :key="rarity"
          :class="['rarity-stat', `rarity-${rarity}`]"
        >
          {{ getRarityLabel(rarity) }}: {{ count }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  projects: {
    type: Array,
    default: () => [],
  },
  filteredCount: {
    type: Number,
    default: 0,
  },
});

const totalCards = computed(() => props.projects.length);

const rarityCounts = computed(() => {
  const counts = {
    common: 0,
    uncommon: 0,
    rare: 0,
    'mythic': 0,
  };

  props.projects.forEach(project => {
    if (project.rarity && counts.hasOwnProperty(project.rarity)) {
      counts[project.rarity]++;
    }
  });

  return counts;
});

function getRarityLabel(rarity) {
  const labels = {
    common: 'Common',
    uncommon: 'Uncommon',
    rare: 'Rare',
    'mythic': 'Mythic',
  };
  return labels[rarity] || rarity;
}
</script>

<style lang="less" scoped>
.collection-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  align-items: center;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.9);
  border-radius: 12px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.stat-label {
  font-weight: 500;
  color: #666;
}

.stat-value {
  font-weight: bold;
  color: #333;
  font-size: 1.1rem;
}

.rarity-stats {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.rarity-stat {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  color: white;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);

  &.rarity-common {
    background: #9b9b9b;
  }

  &.rarity-uncommon {
    background: #4caf50;
  }

  &.rarity-rare {
    background: #2196f3;
  }

  &.rarity-mythic {
    background: #9c27b0;
    box-shadow: 0 2px 4px rgba(156, 39, 176, 0.3);
  }
}

@media (max-width: 768px) {
  .collection-stats {
    flex-direction: column;
    align-items: flex-start;
  }

  .rarity-stats {
    width: 100%;
  }
}
</style>

