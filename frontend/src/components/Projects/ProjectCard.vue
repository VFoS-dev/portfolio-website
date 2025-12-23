<template>
  <div
    :class="['pokemon-card', `rarity-${rarity}`, { flipped: isFlipped, holo: rarity === 'holo-rare' }]"
    @click="flipCard"
  >
    <div class="card-inner">
      <!-- Front of Card -->
      <div class="card-front">
        <div class="card-border">
          <div class="card-header">
            <div class="card-number">#{{ cardNumber }}</div>
            <div class="set-symbol">{{ categorySymbol }}</div>
          </div>
          <div class="card-image-container">
            <img :src="project.img" :alt="project.title" class="card-image" />
            <div v-if="rarity === 'holo-rare'" class="holo-shimmer"></div>
          </div>
          <div class="card-name">{{ project.title }}</div>
          <div class="card-types">
            <span
              v-for="(type, index) in project.stack.slice(0, 3)"
              :key="index"
              :class="['type-badge', getTypeClass(type)]"
            >
              {{ type }}
            </span>
          </div>
          <div class="card-hp">
            <span class="hp-label">Status:</span>
            <span class="hp-value">{{ getStatus() }}</span>
          </div>
        </div>
      </div>

      <!-- Back of Card -->
      <div class="card-back">
        <div class="card-border">
          <div class="card-back-header">
            <div class="card-back-title">{{ project.title }}</div>
            <div class="card-back-set">{{ getCategoryName() }}</div>
          </div>
          <div class="card-back-content">
            <div class="card-description">
              <p>{{ project.description }}</p>
            </div>
            <div class="card-features">
              <h3>Key Features:</h3>
              <ul>
                <li v-for="(feature, index) in project.keyFeatures.slice(0, 4)" :key="index">
                  {{ feature }}
                </li>
              </ul>
            </div>
            <div class="card-stack">
              <h3>Tech Stack:</h3>
              <div class="stack-tags">
                <span v-for="(tech, index) in project.stack" :key="index" class="stack-tag">
                  {{ tech }}
                </span>
              </div>
            </div>
            <div class="card-dates">
              <span>{{ project.startDate }} - {{ project.endDate }}</span>
            </div>
            <div v-if="hasLinks" class="card-links">
              <a
                v-for="(url, key) in project.links"
                :key="key"
                :href="url"
                target="_blank"
                rel="noopener noreferrer"
                class="card-link"
                @click.stop
              >
                {{ key === 'website' ? 'Visit Site' : key === 'github' ? 'GitHub' : key }}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  rarity: {
    type: String,
    default: 'common',
    validator: (value) => ['common', 'uncommon', 'rare', 'holo-rare'].includes(value),
  },
  cardNumber: {
    type: Number,
    required: true,
  },
});

const isFlipped = ref(false);

const categorySymbol = computed(() => {
  const symbols = {
    personal: '★',
    matraex: 'M',
    gimmworks: 'G',
    games: '🎮',
  };
  return symbols[props.project.category] || '?';
});

const hasLinks = computed(() => {
  return props.project.links && Object.keys(props.project.links).length > 0;
});

function flipCard() {
  isFlipped.value = !isFlipped.value;
}

function getTypeClass(type) {
  // Map tech stack to type colors
  const typeMap = {
    React: 'type-fire',
    Vue: 'type-water',
    'Unreal Engine 5': 'type-electric',
    Unity: 'type-electric',
    PHP: 'type-ground',
    SQL: 'type-rock',
    Python: 'type-grass',
    Javascript: 'type-psychic',
    'C++': 'type-steel',
    'C#': 'type-steel',
    Blender: 'type-fairy',
  };

  // Try to find a match (case-insensitive)
  const lowerType = type.toLowerCase();
  for (const [key, value] of Object.entries(typeMap)) {
    if (lowerType.includes(key.toLowerCase())) {
      return value;
    }
  }
  return 'type-normal';
}

function getCategoryName() {
  const names = {
    personal: 'Personal Projects',
    matraex: 'Matraex Inc.',
    gimmworks: 'GIMM Works',
    games: 'Game Projects',
  };
  return names[props.project.category] || 'Projects';
}

function getStatus() {
  if (props.project.endDate === 'Present' || props.project.endDate.toLowerCase().includes('present')) {
    return 'Active';
  }
  return 'Complete';
}
</script>

<style lang="less" scoped>
.pokemon-card {
  width: 100%;
  max-width: 280px;
  height: 390px;
  perspective: 1000px;
  cursor: pointer;
  margin: 1rem;

  &.holo {
    .card-image-container {
      position: relative;
      overflow: hidden;
    }

    .holo-shimmer {
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(
        90deg,
        transparent,
        rgba(255, 255, 255, 0.4),
        transparent
      );
      animation: shimmer 3s infinite;
      pointer-events: none;
    }
  }

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
    transform-style: preserve-3d;
    transition: transform 0.6s;
  }

  &.flipped .card-inner {
    transform: rotateY(180deg);
  }

  .card-front,
  .card-back {
    position: absolute;
    width: 100%;
    height: 100%;
    backface-visibility: hidden;
    -webkit-backface-visibility: hidden;
  }

  .card-back {
    transform: rotateY(180deg);
  }

  .card-border {
    width: 100%;
    height: 100%;
    border-radius: 15px;
    padding: 12px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
  }

  // Rarity-based border colors
  &.rarity-common .card-border {
    border: 4px solid #9b9b9b;
    background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%);
  }

  &.rarity-uncommon .card-border {
    border: 4px solid #4caf50;
    background: linear-gradient(135deg, #f1f8e9 0%, #dcedc8 100%);
  }

  &.rarity-rare .card-border {
    border: 4px solid #2196f3;
    background: linear-gradient(135deg, #e3f2fd 0%, #bbdefb 100%);
  }

  &.rarity-holo-rare .card-border {
    border: 4px solid #9c27b0;
    background: linear-gradient(135deg, #f3e5f5 0%, #e1bee7 100%);
    box-shadow: 0 0 20px rgba(156, 39, 176, 0.5);
  }
}

// Card Front Styles
.card-front {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
    font-size: 0.85rem;
    font-weight: bold;
  }

  .card-number {
    color: #666;
  }

  .set-symbol {
    font-size: 1.2rem;
    color: #333;
  }

  .card-image-container {
    width: 100%;
    height: 180px;
    background: white;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 10px;
    position: relative;
    border: 2px solid #ddd;
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-name {
    font-size: 1.1rem;
    font-weight: bold;
    margin-bottom: 8px;
    color: #333;
    text-align: center;
    min-height: 2.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .card-types {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-bottom: 8px;
    justify-content: center;
  }

  .type-badge {
    padding: 2px 8px;
    border-radius: 12px;
    font-size: 0.7rem;
    font-weight: bold;
    color: white;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);

    &.type-fire {
      background: #f44336;
    }
    &.type-water {
      background: #2196f3;
    }
    &.type-electric {
      background: #ffc107;
      color: #333;
    }
    &.type-grass {
      background: #4caf50;
    }
    &.type-ground {
      background: #8d6e63;
    }
    &.type-rock {
      background: #795548;
    }
    &.type-psychic {
      background: #e91e63;
    }
    &.type-steel {
      background: #607d8b;
    }
    &.type-fairy {
      background: #f48fb1;
    }
    &.type-normal {
      background: #9e9e9e;
    }
  }

  .card-hp {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 4px 8px;
    background: rgba(255, 255, 255, 0.7);
    border-radius: 4px;
    font-size: 0.85rem;
    font-weight: bold;

    .hp-label {
      color: #666;
    }

    .hp-value {
      color: #4caf50;
    }
  }
}

// Card Back Styles
.card-back {
  .card-back-header {
    text-align: center;
    margin-bottom: 12px;
    padding-bottom: 8px;
    border-bottom: 2px solid rgba(0, 0, 0, 0.1);
  }

  .card-back-title {
    font-size: 1.2rem;
    font-weight: bold;
    margin-bottom: 4px;
    color: #333;
  }

  .card-back-set {
    font-size: 0.85rem;
    color: #666;
  }

  .card-back-content {
    flex: 1;
    overflow-y: auto;
    font-size: 0.8rem;
    color: #333;

    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.1);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(0, 0, 0, 0.3);
      border-radius: 3px;
    }
  }

  .card-description {
    margin-bottom: 12px;

    p {
      margin: 0;
      line-height: 1.4;
    }
  }

  .card-features {
    margin-bottom: 12px;

    h3 {
      font-size: 0.9rem;
      margin: 0 0 6px 0;
      color: #555;
    }

    ul {
      margin: 0;
      padding-left: 18px;

      li {
        margin-bottom: 4px;
        line-height: 1.3;
      }
    }
  }

  .card-stack {
    margin-bottom: 12px;

    h3 {
      font-size: 0.9rem;
      margin: 0 0 6px 0;
      color: #555;
    }

    .stack-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 4px;
    }

    .stack-tag {
      padding: 2px 6px;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 8px;
      font-size: 0.7rem;
    }
  }

  .card-dates {
    font-size: 0.75rem;
    color: #666;
    margin-bottom: 8px;
    text-align: center;
  }

  .card-links {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: center;
  }

  .card-link {
    padding: 4px 12px;
    background: #2196f3;
    color: white;
    text-decoration: none;
    border-radius: 12px;
    font-size: 0.75rem;
    font-weight: bold;
    transition: background 0.2s;

    &:hover {
      background: #1976d2;
    }
  }
}

@keyframes shimmer {
  0% {
    left: -100%;
  }
  100% {
    left: 100%;
  }
}

// Hover effect
.pokemon-card:hover {
  transform: translateY(-5px);
  transition: transform 0.2s;

  .card-border {
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  }
}
</style>

