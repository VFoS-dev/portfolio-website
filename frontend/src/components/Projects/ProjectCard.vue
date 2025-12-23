<template>
  <div
    ref="cardRef"
    :class="['pokemon-card', `rarity-${rarity}`, { holo: rarity === 'holo-rare', floating: isFloating, selected: isSelected }]"
    :style="cardStyle"
    @click="handleClick"
    @mouseenter="handleMouseEnter"
    @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove"
  >
    <div class="card-inner">
      <!-- Front of Card -->
      <div class="card-front">
        <div class="card-border">
          <!-- Foil effect overlay for entire card -->
          <div
            v-if="rarity === 'holo-rare'"
            class="holo-shimmer"
            :style="holoStyle"
          ></div>
          
          <!-- Ornate corner decorations -->
          <div class="corner-decoration corner-tl"></div>
          <div class="corner-decoration corner-tr"></div>
          <div class="corner-decoration corner-bl"></div>
          <div class="corner-decoration corner-br"></div>
          
          <!-- Card Header with Mana Cost -->
          <div class="card-header">
            <div class="card-name-bar">
              <span class="card-name">{{ project.title }}</span>
            </div>
            <div class="mana-cost">
              <span class="set-symbol">{{ categorySymbol }}</span>
            </div>
          </div>
          
          <!-- Artwork Area -->
          <div class="card-art-container">
            <div class="art-border"></div>
            <img :src="project.img" :alt="project.title" class="card-image" />
          </div>
          
          <!-- Type Line -->
          <div class="type-line">
            <span class="card-type">{{ getCardType() }}</span>
            <span class="card-number">#{{ cardNumber }}</span>
          </div>
          
          <!-- Text Box -->
          <div class="text-box">
            <div class="text-box-inner">
              <div class="ability-text">
                <div class="tech-stack">
                  <span
                    v-for="(type, index) in project.stack.slice(0, 3)"
                    :key="index"
                    :class="['mana-symbol', getTypeClass(type)]"
                  >
                    {{ getTechSymbol(type) }}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Status Bar -->
          <div class="status-bar">
            <span class="status-label">{{ getStatus() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount } from 'vue';

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
  isSelected: {
    type: Boolean,
    default: false,
  },
  isFloating: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['click']);

const cardRef = ref(null);
const mouseX = ref(0.5);
const mouseY = ref(0.5);
const lastMouseX = ref(0.5);
const lastMouseY = ref(0.5);
const isHovering = ref(false);

const categorySymbol = computed(() => {
  const symbols = {
    personal: '★',
    matraex: 'M',
    gimmworks: 'G',
    games: '🎮',
  };
  return symbols[props.project.category] || '?';
});

// Calculate card tilt based on mouse position
const cardStyle = computed(() => {
  if (!isHovering.value || props.isFloating) {
    return {
      transform: 'perspective(1000px) rotateX(0deg) rotateY(0deg)',
      transition: 'transform 0.3s ease-out',
    };
  }

  const maxTilt = 15;
  const rotateX = ((mouseY.value - 0.5) * -maxTilt).toFixed(2);
  const rotateY = ((mouseX.value - 0.5) * maxTilt).toFixed(2);

  return {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    transition: 'transform 0.1s ease-out',
  };
});

// Calculate holo shimmer position based on mouse
const holoStyle = computed(() => {
  if (props.rarity !== 'holo-rare') {
    return {
      opacity: 0,
      transition: 'opacity 1.5s ease-out, background 1.5s ease-out',
    };
  }

  // Convert mouse position (0-1) to gradient position
  // Use current position if hovering, otherwise use last saved position
  const currentX = mouseX.value;
  const currentY = mouseY.value;
  
  const angle = Math.atan2(currentY - 0.5, currentX - 0.5) * (180 / Math.PI) + 90;
  const distance = Math.sqrt(Math.pow(currentX - 0.5, 2) + Math.pow(currentY - 0.5, 2)) * 2;

  // Rainbow colors for foil effect - wider spread
  const centerPos = distance * 50;
  const spread = 40; // Wider spread for more coverage
  
  const rainbowGradient = `linear-gradient(${angle}deg, 
    transparent 0%, 
    transparent ${Math.max(0, centerPos - spread - 10)}%, 
    rgba(255, 50, 180, 0.6) ${Math.max(0, centerPos - spread)}%, 
    rgba(255, 120, 50, 0.7) ${Math.max(0, centerPos - spread * 0.6)}%, 
    rgba(255, 220, 80, 0.8) ${Math.max(0, centerPos - spread * 0.3)}%, 
    rgba(255, 255, 150, 0.85) ${centerPos}%, 
    rgba(80, 255, 150, 0.8) ${Math.min(100, centerPos + spread * 0.3)}%, 
    rgba(50, 180, 255, 0.7) ${Math.min(100, centerPos + spread * 0.6)}%, 
    rgba(180, 50, 255, 0.6) ${Math.min(100, centerPos + spread)}%, 
    transparent ${Math.min(100, centerPos + spread + 10)}%, 
    transparent 100%)`;

  // Base opacity when not hovering, higher when hovering
  const distanceOpacity = isHovering.value ? Math.min(1, distance * 2) : 0.25;

  return {
    background: rainbowGradient,
    opacity: distanceOpacity,
    transition: 'opacity 1.5s ease-in-out, background 0.3s ease',
  };
});

function handleMouseEnter() {
  if (!props.isFloating) {
    isHovering.value = true;
    // Restore last position when re-entering
    mouseX.value = lastMouseX.value;
    mouseY.value = lastMouseY.value;
  }
}

function handleMouseLeave() {
  // Save current position before leaving
  lastMouseX.value = mouseX.value;
  lastMouseY.value = mouseY.value;
  isHovering.value = false;
  // Keep the position values so the foil stays in place
}

function handleMouseMove(event) {
  if (props.isFloating || !cardRef.value) return;

  const rect = cardRef.value.getBoundingClientRect();
  mouseX.value = (event.clientX - rect.left) / rect.width;
  mouseY.value = (event.clientY - rect.top) / rect.height;
}

function handleClick() {
  if (!props.isFloating) {
    emit('click', props.project);
  }
}

onBeforeUnmount(() => {
  isHovering.value = false;
});

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


function getStatus() {
  if (props.project.endDate === 'Present' || props.project.endDate.toLowerCase().includes('present')) {
    return 'Active';
  }
  return 'Complete';
}

function getCardType() {
  const types = {
    personal: 'Personal Project',
    matraex: 'Client Project',
    gimmworks: 'Team Project',
    games: 'Game Project',
  };
  return types[props.project.category] || 'Project';
}

function getTechSymbol(tech) {
  // Return first letter or a symbol for tech stack
  const symbols = {
    React: '⚛',
    Vue: 'V',
    'Unreal Engine 5': 'UE',
    Unity: 'U',
    PHP: 'P',
    SQL: 'S',
    Python: 'Py',
    Javascript: 'JS',
    'C++': 'C++',
    'C#': 'C#',
    Blender: 'B',
  };
  
  const lowerTech = tech.toLowerCase();
  for (const [key, value] of Object.entries(symbols)) {
    if (lowerTech.includes(key.toLowerCase())) {
      return value;
    }
  }
  return tech.charAt(0).toUpperCase();
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
    .card-border {
      position: relative;
      overflow: hidden;
    }

    .holo-shimmer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
      mix-blend-mode: overlay;
      border-radius: 10px;
      opacity: 0;
    }
  }

  .card-inner {
    position: relative;
    width: 100%;
    height: 100%;
  }

  &.floating {
    cursor: default;
    pointer-events: none;
  }

  &.selected {
    z-index: 100;
  }

  .card-border {
    width: 100%;
    height: 100%;
    padding: 8px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    border: 2px solid #000;
    border-radius: 11px;
    
    // MTG-style black border
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 1px solid #000;
      border-radius: 10px;
      pointer-events: none;
    }
  }

  // Rarity-based frame colors (MTG style)
  &.rarity-common .card-border {
    background: linear-gradient(180deg, #c9c9c9 0%, #b8b8b8 50%, #a8a8a8 100%);
  }

  &.rarity-uncommon .card-border {
    background: linear-gradient(180deg, #4a9b4a 0%, #3d8b3d 50%, #2d7a2d 100%);
  }

  &.rarity-rare .card-border {
    background: linear-gradient(180deg, #4a7ba7 0%, #3d6b97 50%, #2d5a87 100%);
  }

  &.rarity-holo-rare .card-border {
    background: linear-gradient(180deg, #9c4aa7 0%, #8d3a97 50%, #7d2a87 100%);
    box-shadow: 
      0 0 15px rgba(156, 74, 167, 0.6),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
  }
}

// Ornate corner decorations
.corner-decoration {
  position: absolute;
  width: 20px;
  height: 20px;
  z-index: 3;
  
  &::before,
  &::after {
    content: '';
    position: absolute;
    background: #000;
  }
  
  &.corner-tl {
    top: 6px;
    left: 6px;
    &::before {
      width: 12px;
      height: 2px;
      top: 0;
      left: 0;
    }
    &::after {
      width: 2px;
      height: 12px;
      top: 0;
      left: 0;
    }
  }
  
  &.corner-tr {
    top: 6px;
    right: 6px;
    &::before {
      width: 12px;
      height: 2px;
      top: 0;
      right: 0;
    }
    &::after {
      width: 2px;
      height: 12px;
      top: 0;
      right: 0;
    }
  }
  
  &.corner-bl {
    bottom: 6px;
    left: 6px;
    &::before {
      width: 12px;
      height: 2px;
      bottom: 0;
      left: 0;
    }
    &::after {
      width: 2px;
      height: 12px;
      bottom: 0;
      left: 0;
    }
  }
  
  &.corner-br {
    bottom: 6px;
    right: 6px;
    &::before {
      width: 12px;
      height: 2px;
      bottom: 0;
      right: 0;
    }
    &::after {
      width: 2px;
      height: 12px;
      bottom: 0;
      right: 0;
    }
  }
}

// Card Front Styles (MTG-inspired)
.card-front {
  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 4px;
    height: 24px;
    position: relative;
    z-index: 2;
  }

  .card-name-bar {
    flex: 1;
    background: linear-gradient(180deg, #f5f5dc 0%, #e8e8d0 100%);
    border: 1px solid #000;
    border-radius: 2px;
    padding: 2px 6px;
    height: 100%;
    display: flex;
    align-items: center;
  }

  .card-name {
    font-size: 0.9rem;
    font-weight: bold;
    color: #000;
    font-family: 'Times New Roman', serif;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .mana-cost {
    width: 24px;
    height: 24px;
    background: linear-gradient(135deg, #f5f5dc 0%, #e8e8d0 100%);
    border: 1px solid #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-left: 4px;
    font-weight: bold;
    font-size: 0.85rem;
    color: #000;
  }

  .card-art-container {
    width: 100%;
    height: 185px;
    margin: 4px 0;
    position: relative;
    border: 2px solid #000;
    background: #000;
    overflow: hidden;
  }

  .art-border {
    position: absolute;
    top: 2px;
    left: 2px;
    right: 2px;
    bottom: 2px;
    border: 1px solid rgba(255, 255, 255, 0.3);
    z-index: 1;
    pointer-events: none;
  }

  .card-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .type-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: linear-gradient(180deg, #f5f5dc 0%, #e8e8d0 100%);
    border: 1px solid #000;
    border-radius: 2px;
    padding: 2px 6px;
    margin: 4px 0;
    height: 18px;
    font-size: 0.75rem;
    font-weight: bold;
    color: #000;
    font-family: 'Times New Roman', serif;
    font-style: italic;
  }

  .card-type {
    text-transform: capitalize;
  }

  .card-number {
    font-size: 0.7rem;
    opacity: 0.7;
  }

  .text-box {
    flex: 1;
    background: linear-gradient(180deg, #f5f5dc 0%, #e8e8d0 50%, #d8d8c0 100%);
    border: 1px solid #000;
    border-radius: 2px;
    padding: 6px;
    margin: 4px 0;
    min-height: 60px;
    position: relative;
  }

  .text-box-inner {
    width: 100%;
    height: 100%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 1px;
    padding: 4px;
  }

  .ability-text {
    font-size: 0.75rem;
    line-height: 1.3;
    color: #000;
    font-family: 'Times New Roman', serif;
  }

  .tech-stack {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
    align-items: center;
    min-height: 40px;
  }

  .mana-symbol {
    width: 20px;
    height: 20px;
    border: 1px solid #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.65rem;
    font-weight: bold;
    color: #fff;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);

    &.type-fire {
      background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
    }
    &.type-water {
      background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
    }
    &.type-electric {
      background: linear-gradient(135deg, #ffc107 0%, #f57c00 100%);
    }
    &.type-grass {
      background: linear-gradient(135deg, #4caf50 0%, #388e3c 100%);
    }
    &.type-ground {
      background: linear-gradient(135deg, #8d6e63 0%, #6d4c41 100%);
    }
    &.type-rock {
      background: linear-gradient(135deg, #795548 0%, #5d4037 100%);
    }
    &.type-psychic {
      background: linear-gradient(135deg, #e91e63 0%, #c2185b 100%);
    }
    &.type-steel {
      background: linear-gradient(135deg, #607d8b 0%, #455a64 100%);
    }
    &.type-fairy {
      background: linear-gradient(135deg, #f48fb1 0%, #e91e63 100%);
    }
    &.type-normal {
      background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%);
    }
  }

  .status-bar {
    background: linear-gradient(180deg, #f5f5dc 0%, #e8e8d0 100%);
    border: 1px solid #000;
    border-radius: 2px;
    padding: 2px 6px;
    height: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 0.7rem;
    font-weight: bold;
    color: #000;
    font-family: 'Times New Roman', serif;
    margin-top: 4px;
  }
}

// Card Back Styles (MTG-inspired)
.card-back {
  .card-back-header {
    background: linear-gradient(180deg, #f5f5dc 0%, #e8e8d0 100%);
    border: 1px solid #000;
    border-radius: 2px;
    padding: 6px;
    margin-bottom: 6px;
    text-align: center;
  }

  .card-back-title {
    font-size: 1rem;
    font-weight: bold;
    margin-bottom: 2px;
    color: #000;
    font-family: 'Times New Roman', serif;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .card-back-set {
    font-size: 0.75rem;
    color: #000;
    font-family: 'Times New Roman', serif;
    font-style: italic;
    opacity: 0.8;
  }

  .card-back-content {
    flex: 1;
    overflow-y: auto;
    font-size: 0.75rem;
    color: #000;
    font-family: 'Times New Roman', serif;

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
    margin-bottom: 8px;
    padding: 4px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 2px;

    p {
      margin: 0;
      line-height: 1.4;
      font-style: italic;
    }
  }

  .card-features {
    margin-bottom: 8px;
    padding: 4px;

    h3 {
      font-size: 0.8rem;
      margin: 0 0 4px 0;
      color: #000;
      font-weight: bold;
      text-transform: uppercase;
      font-size: 0.7rem;
      letter-spacing: 0.5px;
    }

    ul {
      margin: 0;
      padding-left: 16px;

      li {
        margin-bottom: 2px;
        line-height: 1.3;
        &::marker {
          color: #000;
        }
      }
    }
  }

  .card-stack {
    margin-bottom: 8px;
    padding: 4px;

    h3 {
      font-size: 0.7rem;
      margin: 0 0 4px 0;
      color: #000;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .stack-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 3px;
    }

    .stack-tag {
      padding: 2px 5px;
      background: rgba(0, 0, 0, 0.1);
      border: 1px solid rgba(0, 0, 0, 0.2);
      border-radius: 2px;
      font-size: 0.65rem;
      font-weight: bold;
    }
  }

  .card-dates {
    font-size: 0.7rem;
    color: #000;
    margin-bottom: 6px;
    text-align: center;
    padding: 4px;
    background: rgba(0, 0, 0, 0.05);
    border-radius: 2px;
    font-style: italic;
  }

  .card-links {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    justify-content: center;
    padding: 4px;
  }

  .card-link {
    padding: 3px 8px;
    background: linear-gradient(180deg, #4a7ba7 0%, #3d6b97 100%);
    color: white;
    text-decoration: none;
    border: 1px solid #000;
    border-radius: 2px;
    font-size: 0.7rem;
    font-weight: bold;
    transition: all 0.2s;
    font-family: 'Times New Roman', serif;

    &:hover {
      background: linear-gradient(180deg, #3d6b97 0%, #2d5a87 100%);
      transform: translateY(-1px);
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
    }
  }
}

// Hover effect with mouse following
.pokemon-card:not(.floating) {
  transition: transform 0.3s ease-out, box-shadow 0.3s ease;

  &:hover {
    .card-border {
      box-shadow: 
        0 8px 16px rgba(0, 0, 0, 0.3),
        0 0 0 2px rgba(255, 255, 255, 0.1);
    }
    
    &.rarity-holo-rare .card-border {
      box-shadow: 
        0 8px 20px rgba(156, 74, 167, 0.8),
        0 0 0 2px rgba(255, 255, 255, 0.2),
        inset 0 0 30px rgba(255, 255, 255, 0.15);
    }
  }
}

// Floating card styles
.pokemon-card.floating {
  position: relative;
  z-index: 1001;
  
  .card-border {
    box-shadow: 
      0 20px 40px rgba(0, 0, 0, 0.5),
      0 0 0 4px rgba(255, 255, 255, 0.2);
  }
}
</style>

