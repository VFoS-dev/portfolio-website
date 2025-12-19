<template>
  <div class="menu-bar">
    <div class="menu-item" @click="toggleGameMenu" @mouseenter="keepMenuOpen" @mouseleave="closeGameMenu">
      <span>Game</span>
      <div v-if="gameMenuOpen" class="menu-dropdown" @mouseenter="keepMenuOpen" @mouseleave="closeGameMenu">
        <div class="menu-option" @click="newGame">
          <span>New</span>
          <span class="menu-shortcut">F2</span>
        </div>
        <div class="menu-separator"></div>
        <div class="menu-option" :class="{ 'menu-checked': difficulty === 'beginner' }"
          @click="setDifficulty('beginner')">
          <span>Beginner</span>
          <span v-if="difficulty === 'beginner'" class="menu-checkmark">✓</span>
        </div>
        <div class="menu-option" :class="{ 'menu-checked': difficulty === 'intermediate' }"
          @click="setDifficulty('intermediate')">
          <span>Intermediate</span>
          <span v-if="difficulty === 'intermediate'" class="menu-checkmark">✓</span>
        </div>
        <div class="menu-option" :class="{ 'menu-checked': difficulty === 'advanced' }"
          @click="setDifficulty('advanced')">
          <span>Expert</span>
          <span v-if="difficulty === 'advanced'" class="menu-checkmark">✓</span>
        </div>
        <div class="menu-option" :class="{ 'menu-checked': difficulty === 'custom' }" @click="openCustomDialog">
          <span>Custom...</span>
          <span v-if="difficulty === 'custom'" class="menu-checkmark">✓</span>
        </div>
      </div>
    </div>
    <div class="menu-item" @click="openHelp">
      <span>Help</span>
    </div>
  </div>

  <div class="minesweeper">
    <div class="minesweeper-header">
      <div class="mine-counter">
        <span class="digit">{{ formatNumber(bombCount) }}</span>
      </div>
      <button :class="getFaceButtonClass()" class="face-button" @click="changeState">
        <span v-if="gameStatus === 1">😊</span>
        <span v-else-if="gameStatus === -1">😵</span>
        <span v-else>🙂</span>
      </button>
      <div class="timer">
        <span class="digit">{{ formatNumber(timeElapsed) }}</span>
      </div>
    </div>

    <div class="minesweeper-board-container">
      <div ref="boardRef" class="minesweeper-board" :style="{ '--cols': cols }">
        <div v-for="(row, x) in cells" :key="x + 'row'" class="board-row">
          <div v-for="(cell, y) in row" :id="`${x} ${y}`" :key="`${x} ${y}col`" :class="getCellClass(cell)" class="cell"
            @click="minesweep(`${x} ${y}`)" @contextmenu.prevent="flagCell($event)">
          <div v-if="cell && cell.revealed && cell.proximity > 0" :class="`c-${cell.proximity}`" class="cell-number">
            {{ cell.proximity }}
          </div>
          <span v-if="cell && cell.flagged && !cell.revealed" class="flag-icon">🚩</span>
          <span v-if="cell && cell.revealed && cell.proximity < 0" class="mine-icon">💣</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, inject, watch } from 'vue';
import { windowStore } from '@/stores/windowStore';
import CustomFieldForm from './MinesweeperComponents/CustomFieldForm.vue';

const difficulties = {
  beginner: { rows: 9, cols: 9, mines: 10 },
  intermediate: { rows: 16, cols: 16, mines: 40 },
  advanced: { rows: 16, cols: 30, mines: 99 },
};

const difficulty = ref('beginner');
const cells = ref([]);
const gameStatus = ref(0); // 0 = playing, 1 = won, -1 = lost
const gamePaused = ref(false);
const gameRestart = ref(false);
const timeElapsed = ref(0);
const timerInterval = ref(null);
const boardRef = ref(null);
const boardWidth = ref(400);
const boardHeight = ref(400);
const gameMenuOpen = ref(false);
let menuCloseTimeout = null;

const customRows = ref(16);
const customCols = ref(16);
const customMines = ref(40);

const currentConfig = computed(() => {
  if (difficulty.value === 'custom') {
    return {
      rows: customRows.value,
      cols: customCols.value,
      mines: customMines.value,
    };
  }
  return difficulties[difficulty.value];
});

const rows = computed(() => currentConfig.value.rows);
const cols = computed(() => currentConfig.value.cols);
const totalMines = computed(() => currentConfig.value.mines);

// Inject the setWindowSize function from Window.vue
const setWindowSize = inject('setWindowSize', null);

// Calculate optimal window size based on board dimensions
const optimalWindowSize = computed(() => {
  // Menu bar: ~22px, Header: ~60px, Padding: ~16px, Borders: ~4px
  const menuBarHeight = 22;
  const headerHeight = 60;
  const padding = 16;
  const borders = 4;
  const verticalSpace = menuBarHeight + headerHeight + padding + borders;

  // Calculate a reasonable cell size (aim for 25-30px for good visibility)
  // This ensures the window is sized appropriately for the board
  const targetCellSize = 25;

  // Calculate required board dimensions
  const boardWidth = cols.value * targetCellSize;
  const boardHeight = rows.value * targetCellSize;

  // Add padding and borders to get total window size
  const windowWidth = boardWidth + padding + borders;
  const windowHeight = boardHeight + verticalSpace;

  return {
    width: Math.max(300, windowWidth), // Minimum window width
    height: Math.max(300, windowHeight), // Minimum window height
  };
});

// Watch for changes in rows/cols and update window size
watch([rows, cols, difficulty], () => {
  if (setWindowSize) {
    nextTick(() => {
      if (optimalWindowSize.value) {
        setWindowSize(optimalWindowSize.value.width, optimalWindowSize.value.height);
      }
    });
  }
}, { immediate: true });


const bombCount = computed(() => {
  if (!cells.value.length || !cells.value[0]) return totalMines.value;
  const flagged = cells.value.reduce((t, r) =>
    t + (r?.reduce((st, c) =>
      st + (c?.flagged ? 1 : 0), 0) || 0
    ), 0
  );
  return Math.max(totalMines.value - flagged, 0);
});

function formatNumber(num) {
  return Math.max(0, Math.min(999, num)).toString().padStart(3, '0');
}

function timeout(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function initializeBoard() {
  cells.value = Array(rows.value).fill(null).map(() => Array(cols.value).fill(null));
  gameStatus.value = 0;
  gamePaused.value = false;
  timeElapsed.value = 0;
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
}

function createGame([x, y]) {
  let _c = Array(rows.value).fill(null).map(() => Array(cols.value).fill(null));

  // Mark first click and surrounding cells as no bomb
  for (let j = -1; j <= 1; j++) {
    for (let k = -1; k <= 1; k++) {
      if ((x + j < 0) || (y + k < 0) || (y + k > _c[0].length - 1) || (x + j > _c.length - 1)) continue;
      _c[x + j][y + k] = 'no bomb';
    }
  }

  // Place bombs using the difficulty's mine count
  let nbombs = totalMines.value;
  for (let b = 0; b < nbombs; b) {
    let p = [Math.floor(_c.length * Math.random()), Math.floor(_c[0].length * Math.random())];
    if (!_c[p[0]][p[1]]) {
      _c[p[0]][p[1]] = -1;
      b++;
    }
  }

  function getProximity(x, y, cells) {
    if (cells[x][y] === -1) return -1;
    let count = 0;
    for (let j = -1; j <= 1; j++) {
      for (let k = -1; k <= 1; k++) {
        if ((x + j < 0) || (y + k < 0) || (y + k > cells[0].length - 1) || (x + j > cells.length - 1) || (!j && !k)) continue;
        count -= parseInt(cells[x + j][y + k]) || 0;
      }
    }
    return count;
  }

  _c = _c.map((row, x) => row.map((b, y) => ({
    proximity: getProximity(x, y, _c),
    revealed: false,
    flagged: false,
  })));

  cells.value = floodReveal([x, y], _c);
  gamePaused.value = false;
  startTimer();
}

function floodReveal([x, y], cells) {
  let j, k;
  if (cells[x][y].revealed && cells[x][y].proximity > 0) {
    let flags = 0;
    for (j = -1; j <= 1; j++) {
      for (k = -1; k <= 1; k++) {
        if ((x + j < 0) || (y + k < 0) || (y + k > cells[0].length - 1) || (x + j > cells.length - 1)) continue;
        flags += cells[x + j][y + k].revealed ? 0 : (cells[x + j][y + k].flagged ? 1 : 0);
      }
    }
    if (flags >= cells[x][y].proximity) {
      for (j = -1; j <= 1; j++) {
        for (k = -1; k <= 1; k++) {
          if ((x + j < 0) || (y + k < 0) || (y + k > cells[0].length - 1) || (x + j > cells.length - 1)) continue;
          cells[x + j][y + k].revealed = !cells[x + j][y + k].flagged;
          if (!cells[x + j][y + k].proximity) {
            cells = floodReveal([x + j, y + k], cells);
          }
        }
      }
    }
    return cells;
  }

  cells[x][y].revealed = true;

  for (j = -1; j <= 1; j++) {
    for (k = -1; k <= 1; k++) {
      if ((x + j < 0) || (y + k < 0) || (y + k > cells[0].length - 1) || (x + j > cells.length - 1)) continue;
      if (!cells[x][y].proximity) {
        if (cells[x + j][y + k].revealed) continue;
        cells = floodReveal([x + j, y + k], cells);
      }
    }
  }

  return cells;
}

async function checkWin() {
  await timeout(0);
  let lost = false;
  let win = 0;

  for (const row of cells.value) {
    for (const c of row) {
      if (c && c.proximity < 0 && c.revealed) {
        lost = true;
        break;
      }
      if (c && ((c.proximity >= 0 && c.revealed) || (c.proximity < 0 && c.flagged))) win++;
    }
  }

  win = win === rows.value * cols.value;

  if (win) {
    gameStatus.value = 1;
    gamePaused.value = true;
    stopTimer();
  }
  if (lost) {
    gameStatus.value = -1;
    gamePaused.value = true;
    // Reveal all mines
    cells.value = cells.value.map(row =>
      row.map(cell => {
        if (cell && cell.proximity < 0 && !cell.flagged) {
          return { ...cell, revealed: true };
        }
        return cell;
      })
    );
    stopTimer();
  }
}

function minesweep(id) {
  const [x, y] = id.split(' ').map(i => parseInt(i));
  const cell = cells.value[x][y];
  if (gameStatus.value !== 0) return;
  if (!cell) {
    createGame([x, y]);
  } else if (!cell.flagged) {
    cells.value = floodReveal([x, y], cells.value);
    checkWin();
  }
}

function flagCell(e) {
  e.preventDefault();
  const [x, y] = e.target.id.split(' ').map(i => parseInt(i));
  if (gameStatus.value !== 0 || !cells.value[x][y] || cells.value[x][y].revealed) return;
  cells.value[x][y].flagged = !cells.value[x][y].flagged;
  checkWin();
}

function changeState() {
  if (cells.value.length && cells.value[0] && cells.value[0][0]) {
    initializeBoard();
    gameRestart.value = !gameRestart.value;
  } else {
    initializeBoard();
    gameRestart.value = !gameRestart.value;
  }
}

function setDifficulty(level) {
  difficulty.value = level;
  initializeBoard();
  gameRestart.value = !gameRestart.value;
  gameMenuOpen.value = false;
  // Explicitly update window size
  if (setWindowSize && optimalWindowSize.value) {
    nextTick(() => {
      setWindowSize(optimalWindowSize.value.width, optimalWindowSize.value.height);
    });
  }
}

function openCustomDialog() {
  gameMenuOpen.value = false;
  
  // Initialize with current custom values or defaults
  const initialHeight = difficulty.value === 'custom' ? currentConfig.value.rows : 16;
  const initialWidth = difficulty.value === 'custom' ? currentConfig.value.cols : 16;
  const initialMines = difficulty.value === 'custom' ? currentConfig.value.mines : 40;
  
  // Calculate center position for the window
  const windowWidth = 280;
  const windowHeight = 220;
  const left = (window.innerWidth - windowWidth) / 2;
  const top = (window.innerHeight - windowHeight) / 2;
  
  // Create a Submittable window for custom field input
  const customFieldWindow = windowStore.createWindow({
    title: 'Custom Field',
    icon: '/images/resume/minesweepericon.svg',
    app: 'Submittable',
    width: windowWidth,
    height: windowHeight,
    left: left,
    top: top,
    appProps: {
      component: CustomFieldForm,
      componentProps: {},
      initialData: {
        height: initialHeight,
        width: initialWidth,
        mines: initialMines,
      },
      validate: (data) => {
        const height = data.height || 0;
        const width = data.width || 0;
        const mines = data.mines || 0;
        const maxMines = Math.max(10, height * width - 1);
        
        return (
          height >= 9 && height <= 24 &&
          width >= 9 && width <= 30 &&
          mines >= 10 && mines <= maxMines
        );
      },
      onSubmit: async (data) => {
        customRows.value = data.height;
        customCols.value = data.width;
        customMines.value = data.mines;
        
        difficulty.value = 'custom';
        initializeBoard();
        gameRestart.value = !gameRestart.value;
        
        // Explicitly update window size
        if (setWindowSize && optimalWindowSize.value) {
          nextTick(() => {
            setWindowSize(optimalWindowSize.value.width, optimalWindowSize.value.height);
          });
        }
        
        // Close the Custom Field window
        windowStore.closeWindow(customFieldWindow.id);
        
        return { success: true };
      },
    },
  });
}

function newGame() {
  changeState();
  gameMenuOpen.value = false;
}

function openHelp() {
  window.open('https://minesweeper.online/help/gameplay', '_blank');
}

function toggleGameMenu() {
  gameMenuOpen.value = !gameMenuOpen.value;
  if (menuCloseTimeout) {
    clearTimeout(menuCloseTimeout);
    menuCloseTimeout = null;
  }
}

function keepMenuOpen() {
  if (menuCloseTimeout) {
    clearTimeout(menuCloseTimeout);
    menuCloseTimeout = null;
  }
}

function closeGameMenu() {
  // Small delay to allow clicking menu items
  menuCloseTimeout = setTimeout(() => {
    gameMenuOpen.value = false;
    menuCloseTimeout = null;
  }, 200);
}

function getCellClass(cell) {
  if (!cell) return 'in';
  const shouldReveal = cell.revealed || (gameStatus.value === -1 && cell.proximity < 0 && !cell.flagged);
  if (shouldReveal) {
    return `revealed${cell.proximity < 0 ? ' mine' : ''}`;
  }
  if (cell.flagged) return 'flag';
  return '';
}

function getFaceButtonClass() {
  if (gameStatus.value === 1) return 'win';
  if (gameStatus.value === -1) return 'lose';
  return 'play';
}

function startTimer() {
  if (timerInterval.value) return;

  timerInterval.value = setInterval(() => {
    if (!gamePaused.value && gameStatus.value === 0) {
      timeElapsed.value++;
    }
  }, 1000);
}

function stopTimer() {
  if (timerInterval.value) {
    clearInterval(timerInterval.value);
    timerInterval.value = null;
  }
}

function handleResize() {
  // CSS handles sizing now, but we can still update refs if needed for other purposes
  if (boardRef.value) {
    nextTick(() => {
      const container = boardRef.value?.parentElement?.parentElement;
      if (container) {
        const rect = container.getBoundingClientRect();
        boardWidth.value = rect.width || container.clientWidth;
        boardHeight.value = rect.height || container.clientHeight;
      }
    });
  }
}

let resizeObserver = null;

onMounted(() => {
  initializeBoard();

  // Set initial window size - use setTimeout to ensure window is fully rendered
  if (setWindowSize) {
    setTimeout(() => {
      if (optimalWindowSize.value) {
        setWindowSize(optimalWindowSize.value.width, optimalWindowSize.value.height);
      }
    }, 100);

    // Also try in nextTick as backup
    nextTick(() => {
      if (optimalWindowSize.value) {
        setWindowSize(optimalWindowSize.value.width, optimalWindowSize.value.height);
      }
    });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('resize', handleResize);
    // Also listen for clicks outside menu to close it
    window.addEventListener('click', (e) => {
      if (!e.target.closest('.menu-item')) {
        gameMenuOpen.value = false;
      }
    });
    // Add F2 keyboard shortcut
    window.addEventListener('keydown', (e) => {
      if (e.key === 'F2') {
        e.preventDefault();
        newGame();
      }
    });

    // Use ResizeObserver to track container size changes (CSS handles the actual sizing)
    if (boardRef.value && ResizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        handleResize();
      });
      
      // Observe the board container
      const container = boardRef.value.parentElement?.parentElement;
      if (container) {
        resizeObserver.observe(container);
      }
    }
  }
  nextTick(() => {
    handleResize();
  });
});

onBeforeUnmount(() => {
  stopTimer();
  if (typeof window !== 'undefined') {
    window.removeEventListener('resize', handleResize);
  }
  if (resizeObserver) {
    resizeObserver.disconnect();
  }
});
</script>

<style lang="less" scoped>
@window-bg: #ece9d8;
@inset-depth: 4px;
@inset-depth-large: 6px;
@highlight: #fff;
@shadow: #cfbaba;

.minesweeper {
  box-sizing: unset;
  display: flex;
  flex-direction: column;
  background-color: #c0c0c0;
  margin: auto;
  border: @inset-depth outset #ffffff;
  user-select: none;
}

.minesweeper-header {
  border: @inset-depth inset #ffffff;
  border-top-color: @shadow;
  border-left-color: @shadow;
  border-right-color: @highlight;
  border-bottom-color: @highlight;
  margin: 8px;
  padding: 6px;
  display: flex;
  justify-content: space-between;
  flex-direction: row;
  align-items: center;
  background-color: #c0c0c0;
}

.mine-counter,
.timer {
  background: #000;
  color: #ff0000;
  padding: 2px 4px;
  font-family: 'Courier New', monospace;
  font-size: 20px;
  font-weight: bold;
  min-width: 50px;
  text-align: center;
  border: @inset-depth inset #000;
  box-shadow: inset 1px 1px 0 0 #000;
  letter-spacing: 1px;
}

.face-button {
  width: 26px;
  height: 26px;
  border: @inset-depth outset #ffffff;
  border-right-color: @shadow;
  border-bottom-color: @shadow;
  background: #c0c0c0;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  box-shadow:
    inset 1px 1px 0 0 @shadow,
    inset -1px -1px 0 0 @highlight;

  &:active {
    border: @inset-depth inset #ffffff;
    border-top-color: @shadow;
    border-left-color: @shadow;
    box-shadow:
      inset -1px -1px 0 0 @shadow,
      inset 1px 1px 0 0 @highlight;
  }
}

.minesweeper-board-container {
  width: 100%;
  align-items: center;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 8px;
  box-sizing: border-box;
}

.minesweeper-board {
  border: @inset-depth-large inset #ffffff;
  border-top-color: @shadow;
  border-left-color: @shadow;
  display: grid;
  grid-template-columns: repeat(var(--cols, 9), 1fr);
  width: 100%;
  box-sizing: border-box;
  gap: 0;
  container-type: inline-size;
}

.board-row {
  display: contents;
}

.cell {
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  background-color: #c0c0c0;
  border: @inset-depth-large outset #ffffff;
  border-right-color: @shadow;
  border-bottom-color: @shadow;
  text-align: center;
  cursor: pointer;
  box-shadow:
    inset 1px 1px 0 0 @shadow,
    inset -1px -1px 0 0 @highlight;
  aspect-ratio: 1/1;
  width: 100%;
  min-width: 0;

  &.in {
    background-color: #c0c0c0;
    border: @inset-depth outset #ffffff;
    border-right-color: #5e5e5e;
    border-bottom-color: @shadow;
    box-shadow:
      inset 1px 1px 0 0 @shadow,
      inset -1px -1px 0 0 @highlight;
  }

  &:active:not(.revealed):not(.flagged):not(.in) {
    border: @inset-depth inset #ffffff;
    border-top-color: @shadow;
    border-left-color: @shadow;
    border-right-color: @highlight;
    border-bottom-color: @highlight;
    box-shadow:
      inset -1px -1px 0 0 @shadow,
      inset 1px 1px 0 0 @highlight;
    background-color: #c0c0c0;
  }

  &.revealed {
    border: 1px solid darkgray;
    background-color: #c0c0c0;
    cursor: default;
    box-shadow: none;
  }

  &.flag {
    width: 100%;
    height: 100%;
    background-color: #c0c0c0;
  }

  &.mine.revealed {
    background-color: #ff0000;
  }

  .cell-number {
    font-family: 'MS Sans Serif', 'Tahoma', sans-serif;
    font-weight: bold;
    pointer-events: none;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    font-size: clamp(10px, 2.5cqw, 20px);

    &.c-1 {
      color: #0000ff;
    }

    &.c-2 {
      color: #008000;
    }

    &.c-3 {
      color: #ff0000;
    }

    &.c-4 {
      color: #000080;
    }

    &.c-5 {
      color: #800000;
    }

    &.c-6 {
      color: #008080;
    }

    &.c-7 {
      color: #000000;
    }

    &.c-8 {
      color: @shadow;
    }
  }

  .flag-icon {
    line-height: 1;
    pointer-events: none;
    font-size: clamp(12px, 3cqw, 24px);
  }

  .mine-icon {
    line-height: 1;
    pointer-events: none;
    font-size: clamp(12px, 3cqw, 24px);
  }
}

.menu-bar {
  display: flex;
  background-color: @window-bg;
  border-bottom: 1px solid @shadow;
  padding: 0;
  font-size: 11px;
  font-family: 'MS Sans Serif', 'Tahoma', sans-serif;
  user-select: none;
  position: relative;
  width: 100%;
}

.menu-item {
  position: relative;
  padding: 4px 12px;
  cursor: pointer;
  color: #000;

  &:hover {
    background-color: #316ac5;
    color: @highlight;
  }

  &:active {
    background-color: #214e8c;
  }
}

.menu-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  background-color: #c0c0c0;
  border: 1px solid @shadow;
  border-top: none;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
  min-width: 150px;
  z-index: 1000;
  padding: 2px 0;
}

.menu-option {
  padding: 4px 20px 4px 24px;
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  position: relative;
  color: #000;

  &:hover {
    background-color: #316ac5;
    color: @highlight;
  }

  .menu-shortcut {
    color: @shadow;
    font-size: 10px;
    margin-left: 20px;
  }

  &:hover .menu-shortcut {
    color: @highlight;
  }

  .menu-checkmark {
    position: absolute;
    left: 8px;
    font-weight: bold;
  }
}

.menu-separator {
  height: 1px;
  background-color: @shadow;
  margin: 2px 0;
  border-top: 1px solid #ffffff;
}

</style>
