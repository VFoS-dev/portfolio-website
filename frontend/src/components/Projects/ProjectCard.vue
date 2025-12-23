<template>
  <div ref="cardRef"
    :class="['trading-card', `mana-${getPrimaryManaType()}`, { foil: true, 'rainbow-foil': true, deprecated: isDeprecated, floating: isFloating, selected: isSelected }]"
    :style="cardStyle" @click="handleClick" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
    @mousemove="handleMouseMove">
    <div class="card-inner">
      <!-- Front of Card -->
      <div class="card-front">
        <div class="card-border">
          <!-- Foil effect overlay for entire card -->
          <div class="foil-shimmer" :style="foilStyle"></div>

          <!-- Card Header with Mana Cost -->
          <div class="card-header">
            <div ref="nameBarRef" class="card-name-bar">
              <span class="card-name" :style="nameStyle">{{ project.title }}</span>
            </div>
            <div class="mana-costs">
              <div v-if="project.stack.length > 3" class="mana-cost mana-generic">
                <span class="mana-symbol-text">{{ project.stack.length - 3 }}</span>
              </div>
              <div v-for="(tech, index) in project.stack.slice(0, 3)" :key="index"
                :class="['mana-cost', getTypeClass(tech)]">
                <img :src="getTechIcon(tech)" :alt="tech" class="tech-icon" />
              </div>
            </div>
          </div>

          <!-- Artwork Area -->
          <div class="card-art-container">
            <img :src="project.img" :alt="project.title" class="card-image" />
          </div>

          <!-- Type Line -->
          <div class="type-line">
            <span class="card-type">{{ project.type }} — {{ project.secondaryType }}</span>
            <img :src="project.companyLogo" :alt="project.company" class="company-logo" />
          </div>

          <!-- Text Box -->
          <div class="text-box">
              <div class="ability-text">
                {{ projectSummary }}
              </div>
          </div>

          <!-- Status Bar -->
          <div class="status-bar">
            <span class="rarity-badge">{{ getRarityLabel() }}</span>
            <span v-if="isDeprecated" class="deprecated-badge">DEPRECATED</span>
            <span class="card-number-bottom">#{{ formattedCardNumber }}</span>
            <span class="set-name">{{ project.company || 'VFoS' }}</span>
            <span class="date-range">{{ formatDateRange() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, watch, nextTick, onMounted } from 'vue';
import { projectStore } from '@/stores/projectStore';

const props = defineProps({
  project: {
    type: Object,
    required: true,
  },
  rarity: {
    type: String,
    default: 'common',
    validator: (value) => ['common', 'uncommon', 'rare', 'mythic'].includes(value),
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

// Calculate padding based on highest card number
const formattedCardNumber = computed(() => {
  const maxCardNumber = projectStore.getHighestCardNumber;
  
  // Calculate number of digits needed
  const digits = maxCardNumber > 0 ? Math.floor(Math.log10(maxCardNumber)) + 1 : 1;
  
  // Format with appropriate padding
  return String(props.cardNumber).padStart(digits, '0');
});

// Check if card is deprecated
const isDeprecated = computed(() => {
  return props.project.deprecated === true;
});

// Get project summary (use summary field if available, otherwise truncate description)
const projectSummary = computed(() => {
  if (props.project.summary) {
    return props.project.summary;
  }
  
  // Use description and truncate to fit card
  const description = props.project.description || '';
  const maxLength = 120; // Adjust based on card size
  
  if (description.length <= maxLength) {
    return description;
  }
  
  // Truncate and add ellipsis
  return description.substring(0, maxLength).trim() + '...';
});

// Calculate project duration in months
function calculateDurationMonths(startDateStr, endDateStr) {
  if (!startDateStr) return 0;
  
  // Parse start date
  const startDate = new Date(startDateStr);
  if (isNaN(startDate.getTime())) return 0;
  
  // Parse end date (or use current date if "Present")
  let endDate;
  if (!endDateStr || endDateStr.toLowerCase().includes('present')) {
    endDate = new Date();
  } else {
    endDate = new Date(endDateStr);
    if (isNaN(endDate.getTime())) {
      endDate = new Date();
    }
  }
  
  // Calculate months difference
  const yearsDiff = endDate.getFullYear() - startDate.getFullYear();
  const monthsDiff = endDate.getMonth() - startDate.getMonth();
  let totalMonths = yearsDiff * 12 + monthsDiff;
  
  // If end date day is before start date day, we haven't completed that month yet
  if (endDate.getDate() < startDate.getDate()) {
    totalMonths--;
  }
  
  // Always return at least 0, but if dates are in the same month, return 1 if end is after start
  if (totalMonths === 0 && endDate >= startDate) {
    // Check if it's at least a few days (consider it a month if it's been at least 15 days)
    const daysDiff = Math.floor((endDate - startDate) / (1000 * 60 * 60 * 24));
    if (daysDiff >= 15) {
      return 1;
    }
  }
  
  return Math.max(0, totalMonths);
}

// Calculate rarity based on duration in months
const calculatedRarity = computed(() => {
  const months = calculateDurationMonths(props.project.startDate, props.project.endDate);
  
  if (months >= 12) {
    return 'mythic';
  } else if (months >= 6) {
    return 'rare';
  } else if (months >= 3) {
    return 'uncommon';
  } else {
    return 'common';
  }
});

// Use calculated rarity instead of prop
const effectiveRarity = computed(() => calculatedRarity.value);

const cardRef = ref(null);
const nameBarRef = ref(null);
const mouseX = ref(0.5);
const mouseY = ref(0.5);
const lastMouseX = ref(0.5);
const lastMouseY = ref(0.5);
const isHovering = ref(false);
const nameFontSize = ref(0.9);

// Calculate dynamic font size for project name
const nameStyle = computed(() => {
  return {
    fontSize: `${nameFontSize.value}rem`,
  };
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

// Calculate foil shimmer position based on mouse
const foilStyle = computed(() => {
  // Convert mouse position (0-1) to gradient position
  // Use current position if hovering, otherwise use last saved position
  const currentX = mouseX.value;
  const currentY = mouseY.value;

  const angle = Math.atan2(currentY - 0.5, currentX - 0.5) * (180 / Math.PI) + 90;
  const distance = Math.sqrt(Math.pow(currentX - 0.5, 2) + Math.pow(currentY - 0.5, 2)) * 2;

  const centerPos = distance * 50;
  const spread = 40; // Wider spread for more coverage

  // Rainbow colors for all cards
  const gradient = `linear-gradient(${angle}deg, 
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
  const distanceOpacity = isHovering.value ? Math.min(1, distance * 2) : 0.2;

  return {
    background: gradient,
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

function adjustFontSize() {
  if (!nameBarRef.value || !cardRef.value || props.isFloating) return;

  const nameBar = nameBarRef.value;
  const nameElement = nameBar.querySelector('.card-name');
  if (!nameElement) return;

  // Get available width (accounting for padding)
  const availableWidth = nameBar.offsetWidth - 12; // -12 for padding (6px each side)

  const text = props.project.title;
  const baseFontSize = 0.9;
  let fontSize = baseFontSize;

  // Create a temporary element to measure text width
  const temp = document.createElement('span');
  temp.style.visibility = 'hidden';
  temp.style.position = 'absolute';
  temp.style.fontSize = `${baseFontSize}rem`;
  temp.style.fontFamily = 'Times New Roman, serif';
  temp.style.fontWeight = 'bold';
  temp.style.textTransform = 'uppercase';
  temp.style.letterSpacing = '0.5px';
  temp.style.whiteSpace = 'nowrap';
  temp.textContent = text;
  document.body.appendChild(temp);

  const textWidth = temp.offsetWidth;
  document.body.removeChild(temp);

  // If text is wider than available space, reduce font size
  if (textWidth > availableWidth) {
    fontSize = (availableWidth / textWidth) * baseFontSize;
    // Set minimum font size
    fontSize = Math.max(0.55, fontSize);
  }

  nameFontSize.value = fontSize;
}


function handleClick() {
  if (!props.isFloating) {
    emit('click', props.project);
  }
}

onMounted(() => {
  nextTick(() => {
    adjustFontSize();
    // Watch for window resize
    window.addEventListener('resize', adjustFontSize);
  });
});

onBeforeUnmount(() => {
  isHovering.value = false;
  window.removeEventListener('resize', adjustFontSize);
});

// Adjust font size when project changes
watch(() => props.project.title, () => {
  nextTick(() => {
    adjustFontSize();
  });
});

function getTypeClass(type) {
  // Map tech stack to type colors
  const typeMap = {
    React: 'type-fire',
    'React Native': 'type-fire',
    Vue: 'type-water',
    'Unreal Engine 5': 'type-electric',
    Unity: 'type-electric',
    'Unity WebGL': 'type-electric',
    PHP: 'type-ground',
    SQL: 'type-rock',
    SQLite: 'type-rock',
    Python: 'type-grass',
    Javascript: 'type-psychic',
    'C++': 'type-steel',
    'C#': 'type-steel',
    Blender: 'type-fairy',
    Krita: 'type-fairy',
    'Substance Painter': 'type-fairy',
    HTML: 'type-normal',
    CSS: 'type-normal',
    Markdown: 'type-normal',
    'HTML5 Canvas': 'type-normal',
    'Express.js': 'type-psychic',
    Express: 'type-psychic',
    MongoDB: 'type-grass',
    Mongodb: 'type-grass',
    Firebase: 'type-fire',
    Swift: 'type-water',
    'Socket.io': 'type-psychic',
    Socket: 'type-psychic',
    'AWS S3': 'type-electric',
    AWS: 'type-electric',
    Meteor: 'type-fire',
    JQuery: 'type-normal',
    OneSignal: 'type-psychic',
    Stripe: 'type-normal',
    Algorithm: 'type-psychic',
    Flash: 'type-fire',
    'ActionScript 3': 'type-fire',
    'Adobe Animate': 'type-fire',
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

function getPrimaryManaType() {
  // Get the primary mana type from the first tech stack
  if (props.project.stack && props.project.stack.length > 0) {
    const firstTech = props.project.stack[0];
    const typeClass = getTypeClass(firstTech);
    // Extract the type name (e.g., 'type-fire' -> 'fire')
    return typeClass.replace('type-', '');
  }
  return 'normal';
}


function getRarityLabel() {
  const rarityMap = {
    'common': 'C',
    'uncommon': 'U',
    'rare': 'R',
    'mythic': 'M',
  };
  return rarityMap[effectiveRarity.value] || 'C';
}


function formatDateRange() {
  const start = props.project.startDate || '';
  const end = props.project.endDate || '';

  // Extract year from dates if they're full dates
  const getYear = (dateStr) => {
    if (!dateStr) return '';
    // Try to extract year (look for 4-digit year)
    const yearMatch = dateStr.match(/\b(19|20)\d{2}\b/);
    if (yearMatch) {
      return yearMatch[0];
    }
    return dateStr;
  };

  const startYear = getYear(start);
  const endYear = end.toLowerCase().includes('present') ? 'Present' : getYear(end);

  if (startYear && endYear) {
    return `${startYear} - ${endYear}`;
  }
  if (startYear) {
    return startYear;
  }
  return '';
}

function getTechIcon(tech) {
  // Return path to SVG icon for tech stack based on their logos
  const lowerTech = tech.toLowerCase();

  // React - Atom symbol
  if (lowerTech.includes('react')) {
    if (lowerTech.includes('native')) {
      return '/images/tech-icons/reactnative.svg';
    }
    return '/images/tech-icons/react.svg';
  }

  // Vue - V shape
  if (lowerTech.includes('vue')) {
    return '/images/tech-icons/vue.svg';
  }

  // JavaScript - JS letters
  if (lowerTech.includes('javascript') || lowerTech.includes('js')) {
    return '/images/tech-icons/javascript.svg';
  }

  // Python - Snake
  if (lowerTech.includes('python')) {
    return '/images/tech-icons/python.svg';
  }

  // C++ - C with plus
  if (lowerTech.includes('c++')) {
    return '/images/tech-icons/cpp.svg';
  }

  // C# - C with sharp
  if (lowerTech.includes('c#')) {
    return '/images/tech-icons/csharp.svg';
  }

  // Unity - Cube
  if (lowerTech.includes('unity')) {
    if (lowerTech.includes('webgl')) {
      return '/images/tech-icons/webgl.svg';
    }
    return '/images/tech-icons/unity.svg';
  }

  // Unreal Engine - U shape
  if (lowerTech.includes('unreal')) {
    return '/images/tech-icons/unreal.svg';
  }

  // PHP - Elephant
  if (lowerTech.includes('php')) {
    return '/images/tech-icons/php.svg';
  }

  // SQL - Database
  if (lowerTech.includes('sql')) {
    if (lowerTech.includes('sqlite')) {
      return '/images/tech-icons/sqlite.svg';
    }
    return '/images/tech-icons/sql.svg';
  }

  // Blender - B logo
  if (lowerTech.includes('blender')) {
    return '/images/tech-icons/blender.svg';
  }

  // HTML - H with brackets
  if (lowerTech.includes('html')) {
    if (lowerTech.includes('canvas')) {
      return '/images/tech-icons/canvas.svg';
    }
    return '/images/tech-icons/html.svg';
  }

  // CSS - C with brackets
  if (lowerTech.includes('css')) {
    return '/images/tech-icons/css.svg';
  }

  // Express.js - E
  if (lowerTech.includes('express')) {
    return '/images/tech-icons/express.svg';
  }

  // MongoDB - Leaf
  if (lowerTech.includes('mongo')) {
    return '/images/tech-icons/mongodb.svg';
  }

  // Firebase - Flame
  if (lowerTech.includes('firebase')) {
    return '/images/tech-icons/firebase.svg';
  }

  // Swift - Bird
  if (lowerTech.includes('swift')) {
    return '/images/tech-icons/swift.svg';
  }

  // Socket.io - S
  if (lowerTech.includes('socket')) {
    return '/images/tech-icons/socketio.svg';
  }

  // AWS S3 - Cloud
  if (lowerTech.includes('aws') || lowerTech.includes('s3')) {
    return '/images/tech-icons/aws.svg';
  }

  // Krita - K
  if (lowerTech.includes('krita')) {
    return '/images/tech-icons/krita.svg';
  }

  // Substance Painter - Brush
  if (lowerTech.includes('substance')) {
    return '/images/tech-icons/substance.svg';
  }

  // Meteor - Star
  if (lowerTech.includes('meteor')) {
    return '/images/tech-icons/meteor.svg';
  }

  // JQuery - JQ
  if (lowerTech.includes('jquery')) {
    return '/images/tech-icons/jquery.svg';
  }

  // OneSignal - 1S
  if (lowerTech.includes('onesignal')) {
    return '/images/tech-icons/onesignal.svg';
  }

  // Stripe - S
  if (lowerTech.includes('stripe')) {
    return '/images/tech-icons/stripe.svg';
  }

  // Markdown - M
  if (lowerTech.includes('markdown')) {
    return '/images/tech-icons/markdown.svg';
  }

  // Algorithm - A
  if (lowerTech.includes('algorithm')) {
    return '/images/tech-icons/algorithm.svg';
  }

  // Flash/Adobe Animate - Lightning
  if (lowerTech.includes('flash') || lowerTech.includes('animate') || lowerTech.includes('actionscript')) {
    return '/images/tech-icons/flash.svg';
  }

  // Default - Return a placeholder or first letter
  // For now, return a generic icon path (you could create a default.svg)
  return '/images/tech-icons/markdown.svg'; // Using markdown as fallback
}
</script>

<style lang="less" scoped>
.trading-card {
  width: 100%;
  max-width: 380px;
  height: 480px;
  perspective: 1200px;
  cursor: pointer;
  margin: 0;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              box-shadow 0.3s ease;

  &.foil {
    .card-border {
      position: relative;
      overflow: hidden;
    }

    .foil-shimmer {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 10;
      mix-blend-mode: overlay;
      border-radius: 10px;
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

  &.deprecated {
    opacity: 0.6;
    filter: grayscale(0.7);

    .card-border {
      border-color: #999;
      background: linear-gradient(180deg, #d0d0d0 0%, #b8b8b8 50%, #a0a0a0 100%);
    }

    .foil-shimmer {
      opacity: 0.1;
    }
  }

  .card-border {
    width: 100%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    position: relative;
    overflow: hidden;
    border: 3px solid #1a1a1a;
    border-radius: 14px;
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.15),
      0 2px 4px rgba(0, 0, 0, 0.1),
      inset 0 1px 0 rgba(255, 255, 255, 0.1);
    transition: box-shadow 0.3s ease, transform 0.3s ease;

    // MTG-style black border
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      border: 1px solid rgba(0, 0, 0, 0.3);
      border-radius: 12px;
      pointer-events: none;
    }
  }

  // Mana-based frame colors (MTG style)
  &.mana-fire .card-border {
    background: linear-gradient(180deg, #ff6b6b 0%, #ee5a5a 50%, #dd4a4a 100%);
  }

  &.mana-water .card-border {
    background: linear-gradient(180deg, #4dabf7 0%, #3d9be7 50%, #2d8bd7 100%);
  }

  &.mana-electric .card-border {
    background: linear-gradient(180deg, #ffd43b 0%, #ffc92b 50%, #ffbe1b 100%);
  }

  &.mana-grass .card-border {
    background: linear-gradient(180deg, #51cf66 0%, #40bf55 50%, #2faf44 100%);
  }

  &.mana-ground .card-border {
    background: linear-gradient(180deg, #a98467 0%, #987456 50%, #876445 100%);
  }

  &.mana-rock .card-border {
    background: linear-gradient(180deg, #8b6f47 0%, #7a5f36 50%, #694f25 100%);
  }

  &.mana-psychic .card-border {
    background: linear-gradient(180deg, #f06292 0%, #e05282 50%, #d04272 100%);
  }

  &.mana-steel .card-border {
    background: linear-gradient(180deg, #748b9c 0%, #637b8c 50%, #526b7c 100%);
  }

  &.mana-fairy .card-border {
    background: linear-gradient(180deg, #f48fb1 0%, #e47fa1 50%, #d46f91 100%);
  }

  &.mana-normal .card-border {
    background: linear-gradient(180deg, #c9c9c9 0%, #b8b8b8 50%, #a8a8a8 100%);
  }

  // Foil cards get an extra glow effect
  &.foil .card-border {
    box-shadow:
      0 0 15px rgba(255, 255, 255, 0.3),
      inset 0 0 20px rgba(255, 255, 255, 0.1);
  }

  // Rainbow foil cards get enhanced glow
  &.rainbow-foil .card-border {
    box-shadow:
      0 0 20px rgba(255, 100, 200, 0.4),
      inset 0 0 25px rgba(255, 255, 255, 0.15);
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
    gap: 4px;
    min-width: 0; // Allow flex children to shrink
  }

  .card-name-bar {
    flex: 1;
    min-width: 0; // Allow shrinking
    background: linear-gradient(180deg, #f5f5dc 0%, #e8e8d0 100%);
    border: 1px solid #000;
    border-radius: 2px;
    padding: 2px 6px;
    height: 100%;
    display: flex;
    align-items: center;
    overflow: hidden;
  }

  .card-name {
    font-weight: bold;
    color: #000;
    font-family: 'Times New Roman', serif;
    letter-spacing: 0.5px;
    white-space: nowrap;
    min-width: 0; // Allow text to shrink
    flex-shrink: 1;
    line-height: 1;
    font-size: 1rem;
  }

  .mana-costs {
    display: flex;
    gap: 2px;
    align-items: center;
    flex-shrink: 0; // Prevent mana costs from shrinking
    min-width: fit-content;
  }

  .mana-cost {
    width: 18px;
    height: 18px;
    border: 1px solid #000;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 0.6rem;
    color: #fff;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.5);
    position: relative;
    overflow: hidden;
    flex-shrink: 0;

    .mana-symbol-text {
      position: relative;
      z-index: 1;
      line-height: 1;
    }

    .tech-icon {
      width: 12px;
      height: 12px;
      object-fit: contain;
      position: relative;
      z-index: 1;
      filter: brightness(0) invert(1);
    }

    // Type-based colors for mana symbols
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

    &.mana-generic {
      background: linear-gradient(135deg, #9e9e9e 0%, #757575 100%);
      color: #fff;
    }
  }

  .card-art-container {
    width: 100%;
    height: 220px;
    margin: 6px 0;
    position: relative;
    border: 2px solid #1a1a1a;
    border-radius: 4px;
    background: #000;
    overflow: hidden;
    box-shadow: 
      inset 0 2px 4px rgba(0, 0, 0, 0.3),
      0 1px 2px rgba(0, 0, 0, 0.2);
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
    background: linear-gradient(180deg, #f8f8e8 0%, #f0f0d8 100%);
    border: 1.5px solid #1a1a1a;
    border-radius: 3px;
    padding: 4px 10px;
    margin: 5px 0;
    height: 24px;
    font-size: 0.85rem;
    font-weight: bold;
    color: #1a1a1a;
    font-family: 'Times New Roman', serif;
    font-style: italic;
    box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.1);
  }

  .card-type {
    text-transform: capitalize;
  }

  .company-logo {
    height: 16px;
    width: auto;
    object-fit: contain;
    opacity: 0.8;
  }

  .text-box {
    flex: 1;
    background: linear-gradient(180deg, #f8f8e8 0%, #f0f0d8 50%, #e8e8d0 100%);
    border: 1.5px solid #1a1a1a;
    border-radius: 3px;
    padding: 10px;
    margin: 5px 0;
    min-height: 90px;
    position: relative;
    box-shadow: inset 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .text-box-inner {
    width: 100%;
    height: 100%;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 1px;
    padding: 4px;
  }

  .ability-text {
    font-size: 0.85rem;
    line-height: 1.5;
    color: #1a1a1a;
    font-family: 'Times New Roman', serif;
    text-align: left;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 5;
    line-clamp: 5;
    -webkit-box-orient: vertical;
    word-wrap: break-word;
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

    .tech-icon-small {
      width: 14px;
      height: 14px;
      object-fit: contain;
      filter: brightness(0) invert(1);
    }

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
    border: 1.5px solid #1a1a1a;
    border-radius: 3px;
    padding: 4px 8px;
    height: 22px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.75rem;
    font-weight: bold;
    color: #1a1a1a;
    font-family: 'Times New Roman', serif;
    margin-top: 4px;
    gap: 8px;

    .rarity-badge {
      font-weight: bold;
      min-width: 20px;
    }

    .deprecated-badge {
      background: #f44336;
      color: white;
      padding: 1px 4px;
      border-radius: 2px;
      font-size: 0.55rem;
      font-weight: bold;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border: 1px solid #d32f2f;
    }

    .card-number-bottom {
      font-weight: normal;
      opacity: 0.8;
    }

    .set-name {
      flex: 1;
      text-align: center;
      font-style: italic;
    }

    .date-range {
      font-weight: normal;
      font-size: 0.6rem;
      opacity: 0.9;
    }
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
.trading-card:not(.floating) {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
              box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-8px) scale(1.02);

    .card-border {
      box-shadow:
        0 12px 24px rgba(0, 0, 0, 0.25),
        0 6px 12px rgba(0, 0, 0, 0.15),
        0 0 0 3px rgba(255, 255, 255, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);
    }

    &.foil .card-border {
      box-shadow:
        0 14px 28px rgba(200, 220, 255, 0.4),
        0 8px 16px rgba(200, 220, 255, 0.3),
        0 0 0 3px rgba(255, 255, 255, 0.25),
        inset 0 0 40px rgba(255, 255, 255, 0.2);
    }

    &.rainbow-foil .card-border {
      box-shadow:
        0 16px 32px rgba(255, 100, 200, 0.5),
        0 10px 20px rgba(255, 100, 200, 0.4),
        0 0 0 3px rgba(255, 255, 255, 0.3),
        inset 0 0 45px rgba(255, 255, 255, 0.25);
    }
  }
}

// Floating card styles
.trading-card.floating {
  position: relative;
  z-index: 1001;

  .card-border {
    box-shadow:
      0 24px 48px rgba(0, 0, 0, 0.4),
      0 12px 24px rgba(0, 0, 0, 0.3),
      0 0 0 4px rgba(255, 255, 255, 0.25),
      inset 0 2px 0 rgba(255, 255, 255, 0.3);
    animation: floatGlow 3s ease-in-out infinite;
  }
}

@keyframes floatGlow {
  0%, 100% {
    box-shadow:
      0 24px 48px rgba(0, 0, 0, 0.4),
      0 12px 24px rgba(0, 0, 0, 0.3),
      0 0 0 4px rgba(255, 255, 255, 0.25),
      inset 0 2px 0 rgba(255, 255, 255, 0.3);
  }
  50% {
    box-shadow:
      0 28px 56px rgba(0, 0, 0, 0.45),
      0 14px 28px rgba(0, 0, 0, 0.35),
      0 0 0 5px rgba(255, 255, 255, 0.3),
      inset 0 2px 0 rgba(255, 255, 255, 0.35);
  }
}
</style>
