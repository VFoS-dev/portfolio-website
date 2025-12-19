<template>
  <div class="word-app">
    <!-- Menu Bar -->
    <div class="menu-bar">
      <div class="menu-item" @click="toggleFileMenu">
        File
        <div v-if="showFileMenu" class="menu-dropdown">
          <div class="menu-option" @click="handleSave">Save</div>
          <div class="menu-option" @click="handleSaveAs">Save As...</div>
        </div>
      </div>
      <div class="menu-item">Edit</div>
      <div class="menu-item">View</div>
      <div class="menu-item">Insert</div>
      <div class="menu-item">Format</div>
      <div class="menu-item">Tools</div>
      <div class="menu-item">Table</div>
      <div class="menu-item">Window</div>
      <div class="menu-item">Help</div>
    </div>

    <!-- Standard Toolbar -->
    <div class="toolbar standard-toolbar">
      <button class="toolbar-btn" title="New" @click="handleNew">
        <span class="icon">📄</span>
      </button>
      <button class="toolbar-btn" title="Open" @click="handleOpen">
        <span class="icon">📁</span>
      </button>
      <button class="toolbar-btn" title="Save" @click="handleSave">
        <span class="icon">💾</span>
      </button>
      <div class="toolbar-separator"></div>
      <button class="toolbar-btn" title="Cut" @click="handleCut">
        <span class="icon">✂️</span>
      </button>
      <button class="toolbar-btn" title="Copy" @click="handleCopy">
        <span class="icon">📋</span>
      </button>
      <button class="toolbar-btn" title="Paste" @click="handlePaste">
        <span class="icon">📄</span>
      </button>
      <div class="toolbar-separator"></div>
      <button class="toolbar-btn" title="Undo" @click="handleUndo" :disabled="!canUndo">
        <span class="icon">↶</span>
      </button>
      <button class="toolbar-btn" title="Redo" @click="handleRedo" :disabled="!canRedo">
        <span class="icon">↷</span>
      </button>
    </div>

    <!-- Formatting Toolbar -->
    <div class="toolbar formatting-toolbar">
      <!-- Font Type -->
      <select v-model="selectedFont" @change="applyFont" class="font-selector">
        <optgroup
          v-for="group in availableFonts"
          :key="group.group"
          :label="group.group"
        >
          <option
            v-for="font in group.fonts"
            :key="font"
            :value="font"
            :style="{ fontFamily: font }"
          >
            {{ font }}
          </option>
        </optgroup>
      </select>

      <!-- Font Size -->
      <select v-model="selectedFontSize" @change="applyFontSize" class="font-size-selector">
        <option v-for="size in fontSizes" :key="size" :value="size">{{ size }}</option>
      </select>

      <div class="toolbar-separator"></div>

      <!-- Formatting Buttons -->
      <button
        class="toolbar-btn"
        :class="{ active: isBold }"
        title="Bold"
        @click="toggleBold"
      >
        <strong>B</strong>
      </button>
      <button
        class="toolbar-btn"
        :class="{ active: isItalic }"
        title="Italic"
        @click="toggleItalic"
      >
        <em>I</em>
      </button>
      <button
        class="toolbar-btn"
        :class="{ active: isUnderline }"
        title="Underline"
        @click="toggleUnderline"
      >
        <u>U</u>
      </button>

      <div class="toolbar-separator"></div>

      <!-- Alignment Buttons -->
      <button
        class="toolbar-btn"
        :class="{ active: isLeftAlign }"
        title="Align Left"
        @click="alignLeft"
      >
        <span class="icon">⬅</span>
      </button>
      <button
        class="toolbar-btn"
        :class="{ active: isCenterAlign }"
        title="Center"
        @click="alignCenter"
      >
        <span class="icon">⬌</span>
      </button>

      <div class="toolbar-separator"></div>

      <!-- List Buttons -->
      <button
        class="toolbar-btn"
        :class="{ active: isBulletList }"
        title="Bulleted List"
        @click="toggleBulletList"
      >
        <span class="icon">•</span>
      </button>
      <button
        class="toolbar-btn"
        :class="{ active: isOrderedList }"
        title="Numbered List"
        @click="toggleOrderedList"
      >
        <span class="icon">123</span>
      </button>
    </div>

    <!-- Editor -->
    <div class="editor-wrapper">
      <PagedEditor
        ref="editorRef"
        v-model="editorContent"
        @focus="handleEditorFocus"
        @blur="handleEditorBlur"
        @update:modelValue="handleContentUpdate"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue';
import PagedEditor from './WordComponents/PagedEditor.vue';
import { cubeStore } from '@/stores/cubeStore';
import { toggleMark, setBlockType } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';
import { undo, redo, undoDepth, redoDepth } from 'prosemirror-history';
import { EditorState } from 'prosemirror-state';
import { DOMParser } from 'prosemirror-model';

const props = defineProps({
  content: {
    type: String,
    default: '',
  },
  isCustom: {
    type: Boolean,
    default: false,
  },
  originalTitle: {
    type: String,
    default: '',
  },
});

const editorRef = ref(null);
const editorContent = ref(props.content || '');
const showFileMenu = ref(false);

// Watch for changes to props.content and update editorContent
watch(() => props.content, (newContent) => {
  if (newContent !== undefined && newContent !== null && newContent !== editorContent.value) {
    editorContent.value = newContent;
  }
});
const selectedFont = ref('Times New Roman');
const selectedFontSize = ref(12);
const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

// Platform detection and font lists
function detectPlatform() {
  const userAgent = navigator.userAgent || navigator.platform || '';
  const platform = userAgent.toLowerCase();
  
  if (/iphone|ipad|ipod/.test(platform)) {
    return 'ios';
  } else if (/android/.test(platform)) {
    return 'android';
  } else if (/mac/.test(platform) || /darwin/.test(platform)) {
    return 'macos';
  } else if (/win/.test(platform)) {
    return 'windows';
  } else if (/linux/.test(platform)) {
    return 'linux';
  }
  return 'unknown';
}

const platform = detectPlatform();

// Font lists by platform
const platformFonts = {
  ios: [
    { group: 'Serif', fonts: ['Times New Roman', 'Georgia', 'Palatino', 'Baskerville', 'Hoefler Text', 'Didot'] },
    { group: 'Sans-Serif', fonts: ['Arial', 'Helvetica', 'Helvetica Neue', 'Verdana', 'Trebuchet MS', 'Lucida Grande', 'Geneva', 'Optima', 'Futura', 'Gill Sans'] },
    { group: 'Monospace', fonts: ['Courier New', 'Courier', 'Monaco', 'Menlo'] },
    { group: 'Display', fonts: ['Impact', 'Comic Sans MS', 'Marker Felt', 'Chalkduster', 'Papyrus'] },
    { group: 'Script', fonts: ['Brush Script', 'Lucida Handwriting', 'Apple Chancery', 'Snell Roundhand', 'Zapfino'] },
  ],
  macos: [
    { group: 'Serif', fonts: ['Times New Roman', 'Georgia', 'Palatino', 'Baskerville', 'Hoefler Text', 'Didot', 'Goudy Old Style'] },
    { group: 'Sans-Serif', fonts: ['Arial', 'Helvetica', 'Helvetica Neue', 'Verdana', 'Trebuchet MS', 'Lucida Grande', 'Geneva', 'Optima', 'Futura', 'Gill Sans'] },
    { group: 'Monospace', fonts: ['Courier New', 'Courier', 'Monaco', 'Menlo'] },
    { group: 'Display', fonts: ['Impact', 'Comic Sans MS', 'Marker Felt', 'Chalkduster', 'Papyrus'] },
    { group: 'Script', fonts: ['Brush Script', 'Lucida Handwriting', 'Apple Chancery', 'Snell Roundhand', 'Zapfino'] },
  ],
  windows: [
    { group: 'Serif', fonts: ['Times New Roman', 'Georgia', 'Palatino Linotype', 'Book Antiqua', 'Garamond', 'Baskerville Old Face', 'Bodoni MT', 'Century Schoolbook', 'Goudy Old Style'] },
    { group: 'Sans-Serif', fonts: ['Arial', 'Helvetica', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Lucida Sans Unicode', 'Segoe UI', 'Calibri', 'Candara', 'Corbel', 'Franklin Gothic Medium'] },
    { group: 'Monospace', fonts: ['Courier New', 'Courier', 'Consolas', 'Lucida Console'] },
    { group: 'Display', fonts: ['Impact', 'Comic Sans MS', 'Arial Black', 'Copperplate', 'Copperplate Gothic Light', 'Copperplate Gothic Bold', 'Papyrus'] },
    { group: 'Script', fonts: ['Brush Script MT', 'Lucida Handwriting', 'Script MT Bold'] },
  ],
  android: [
    { group: 'Serif', fonts: ['Times New Roman', 'Georgia', 'Droid Serif', 'Noto Serif'] },
    { group: 'Sans-Serif', fonts: ['Arial', 'Helvetica', 'Verdana', 'Roboto', 'Droid Sans', 'Noto Sans'] },
    { group: 'Monospace', fonts: ['Courier New', 'Courier', 'Droid Sans Mono', 'Noto Sans Mono'] },
    { group: 'Display', fonts: ['Impact', 'Comic Sans MS'] },
  ],
  linux: [
    { group: 'Serif', fonts: ['Times New Roman', 'Georgia', 'Liberation Serif', 'DejaVu Serif'] },
    { group: 'Sans-Serif', fonts: ['Arial', 'Helvetica', 'Verdana', 'Liberation Sans', 'DejaVu Sans'] },
    { group: 'Monospace', fonts: ['Courier New', 'Courier', 'Liberation Mono', 'DejaVu Sans Mono'] },
    { group: 'Display', fonts: ['Impact', 'Comic Sans MS'] },
  ],
  unknown: [
    { group: 'Serif', fonts: ['Times New Roman', 'Georgia', 'Palatino'] },
    { group: 'Sans-Serif', fonts: ['Arial', 'Helvetica', 'Verdana', 'Trebuchet MS'] },
    { group: 'Monospace', fonts: ['Courier New', 'Courier'] },
    { group: 'Display', fonts: ['Impact', 'Comic Sans MS'] },
  ],
};

const availableFonts = platformFonts[platform] || platformFonts.unknown;

// State tracking
const isBold = ref(false);
const isItalic = ref(false);
const isUnderline = ref(false);
const isLeftAlign = ref(true);
const isCenterAlign = ref(false);
const isBulletList = ref(false);
const isOrderedList = ref(false);
const canUndo = ref(false);
const canRedo = ref(false);

let editorView = null;
let updateInterval = null;

// Initialize editor view reference
onMounted(async () => {
  await nextTick();
  if (editorRef.value) {
    editorView = editorRef.value.getEditorView();
    const schema = editorRef.value.getSchema();
    
    // Set up update interval to check editor state
    updateInterval = setInterval(() => {
      if (editorView) {
        updateToolbarState();
      }
    }, 100);
  }
  
  // Load saved content if available
  const savedContent = localStorage.getItem('wordDocument');
  if (savedContent && !props.content) {
    editorContent.value = savedContent;
  }
});

onBeforeUnmount(() => {
  if (updateInterval) {
    clearInterval(updateInterval);
  }
  cubeStore.toggleKeyRotate(true);
});

function updateToolbarState() {
  if (!editorView) return;
  
  const { state } = editorView;
  const { selection } = state;
  const { $from } = selection;
  
  // Check marks
  isBold.value = state.schema.marks.strong?.isInSet(selection.$from.marks()) || false;
  isItalic.value = state.schema.marks.em?.isInSet(selection.$from.marks()) || false;
  isUnderline.value = state.schema.marks.underline?.isInSet(selection.$from.marks()) || false;
  
  // Check font family
  const fontFamilyMark = state.schema.marks.fontFamily?.isInSet(selection.$from.marks());
  if (fontFamilyMark && fontFamilyMark.attrs.family) {
    selectedFont.value = fontFamilyMark.attrs.family;
  }
  
  // Check font size
  const fontSizeMark = state.schema.marks.fontSize?.isInSet(selection.$from.marks());
  if (fontSizeMark && fontSizeMark.attrs.size) {
    const sizeMatch = fontSizeMark.attrs.size.match(/(\d+)pt/);
    if (sizeMatch) {
      selectedFontSize.value = parseInt(sizeMatch[1]);
    }
  }
  
  // Check alignment (simplified - would need proper alignment detection)
  // For now, we'll just track button state
  
  // Check list types
  const listTypes = ['bullet_list', 'ordered_list'];
  const node = $from.node($from.depth);
  isBulletList.value = node.type.name === 'bullet_list';
  isOrderedList.value = node.type.name === 'ordered_list';
  
  // Check undo/redo
  canUndo.value = undoDepth(state) > 0;
  canRedo.value = redoDepth(state) > 0;
}

function getEditorView() {
  if (!editorView && editorRef.value) {
    editorView = editorRef.value.getEditorView();
  }
  return editorView;
}

function getSchema() {
  if (editorRef.value) {
    return editorRef.value.getSchema();
  }
  return null;
}

function applyCommand(command) {
  const view = getEditorView();
  if (!view) return false;
  
  const { state, dispatch } = view;
  return command(state, dispatch);
}

// Font functions
function applyFont() {
  const view = getEditorView();
  if (!view) return;
  
  const schema = getSchema();
  if (!schema || !schema.marks.fontFamily) return;
  
  const { state, dispatch } = view;
  const { selection } = state;
  const { $from, $to } = selection;
  
  const fontFamilyMark = schema.marks.fontFamily;
  const tr = state.tr;
  
  // Remove existing fontFamily marks in selection
  const existingMark = fontFamilyMark.isInSet($from.marks());
  if (existingMark && existingMark.attrs.family === selectedFont.value) {
    // Already has this font, remove it
    tr.removeMark($from.pos, $to.pos, fontFamilyMark);
  } else {
    // Add or update fontFamily mark
    tr.removeMark($from.pos, $to.pos, fontFamilyMark);
    tr.addMark($from.pos, $to.pos, fontFamilyMark.create({ family: selectedFont.value }));
  }
  
  dispatch(tr);
}

function applyFontSize() {
  const view = getEditorView();
  if (!view) return;
  
  const schema = getSchema();
  if (!schema || !schema.marks.fontSize) return;
  
  const { state, dispatch } = view;
  const { selection } = state;
  const { $from, $to } = selection;
  
  const fontSizeMark = schema.marks.fontSize;
  const tr = state.tr;
  const fontSizeValue = `${selectedFontSize.value}pt`;
  
  // Remove existing fontSize marks in selection
  const existingMark = fontSizeMark.isInSet($from.marks());
  if (existingMark && existingMark.attrs.size === fontSizeValue) {
    // Already has this size, remove it
    tr.removeMark($from.pos, $to.pos, fontSizeMark);
  } else {
    // Add or update fontSize mark
    tr.removeMark($from.pos, $to.pos, fontSizeMark);
    tr.addMark($from.pos, $to.pos, fontSizeMark.create({ size: fontSizeValue }));
  }
  
  dispatch(tr);
}

// Formatting functions
function toggleBold() {
  const schema = getSchema();
  if (!schema) return;
  applyCommand(toggleMark(schema.marks.strong));
}

function toggleItalic() {
  const schema = getSchema();
  if (!schema) return;
  applyCommand(toggleMark(schema.marks.em));
}

function toggleUnderline() {
  const schema = getSchema();
  if (!schema) return;
  applyCommand(toggleMark(schema.marks.underline));
}

// Alignment functions
function alignLeft() {
  const view = getEditorView();
  if (!view) return;
  
  const { state } = view;
  const { selection } = state;
  const { $from, $to } = selection;
  
  // Find block nodes in selection
  const blockNodes = [];
  state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
    if (node.isBlock && node.type.name !== 'page') {
      blockNodes.push({ node, pos });
    }
  });
  
  // If no blocks in selection, find the current block
  if (blockNodes.length === 0) {
    let depth = $from.depth;
    while (depth > 0) {
      const node = $from.node(depth);
      if (node.type.name !== 'page' && node.isBlock) {
        blockNodes.push({ node, pos: $from.start(depth) - 1 });
        break;
      }
      depth--;
    }
  }
  
  // Apply alignment via DOM
  blockNodes.forEach(({ pos }) => {
    const domNode = view.nodeDOM(pos);
    if (domNode) {
      domNode.style.textAlign = 'left';
    }
  });
  
  isLeftAlign.value = true;
  isCenterAlign.value = false;
}

function alignCenter() {
  const view = getEditorView();
  if (!view) return;
  
  const { state } = view;
  const { selection } = state;
  const { $from, $to } = selection;
  
  // Find block nodes in selection
  const blockNodes = [];
  state.doc.nodesBetween($from.pos, $to.pos, (node, pos) => {
    if (node.isBlock && node.type.name !== 'page') {
      blockNodes.push({ node, pos });
    }
  });
  
  // If no blocks in selection, find the current block
  if (blockNodes.length === 0) {
    let depth = $from.depth;
    while (depth > 0) {
      const node = $from.node(depth);
      if (node.type.name !== 'page' && node.isBlock) {
        blockNodes.push({ node, pos: $from.start(depth) - 1 });
        break;
      }
      depth--;
    }
  }
  
  // Apply alignment via DOM
  blockNodes.forEach(({ pos }) => {
    const domNode = view.nodeDOM(pos);
    if (domNode) {
      domNode.style.textAlign = 'center';
    }
  });
  
  isLeftAlign.value = false;
  isCenterAlign.value = true;
}

// List functions
function toggleBulletList() {
  const schema = getSchema();
  if (!schema || !schema.nodes.bullet_list) return;
  
  const bulletList = schema.nodes.bullet_list;
  const view = getEditorView();
  if (!view) return;
  
  const { state } = view;
  const { selection } = state;
  const { $from } = selection;
  
  // Check if we're already in a bullet list
  let inBulletList = false;
  let depth = $from.depth;
  while (depth > 0) {
    const node = $from.node(depth);
    if (node.type.name === 'bullet_list') {
      inBulletList = true;
      break;
    }
    if (node.type.name === 'list_item') {
      // Check parent
      const parent = $from.node(depth - 1);
      if (parent && parent.type.name === 'bullet_list') {
        inBulletList = true;
        break;
      }
    }
    depth--;
  }
  
  if (inBulletList) {
    // Unwrap: convert list items to paragraphs
    const tr = state.tr;
    const listItems = [];
    state.doc.nodesBetween($from.pos, selection.$to.pos, (node, pos) => {
      if (node.type.name === 'list_item') {
        listItems.push({ node, pos });
      }
    });
    
    if (listItems.length === 0) {
      // Find current list item
      depth = $from.depth;
      while (depth > 0) {
        const node = $from.node(depth);
        if (node.type.name === 'list_item') {
          listItems.push({ node, pos: $from.start(depth) - 1 });
          break;
        }
        depth--;
      }
    }
    
    listItems.reverse().forEach(({ node, pos }) => {
      const paragraph = state.schema.nodes.paragraph.create({}, node.content);
      tr.replaceWith(pos, pos + node.nodeSize, paragraph);
    });
    
    view.dispatch(tr);
  } else {
    // Wrap in list
    applyCommand(wrapInList(bulletList));
  }
}

function toggleOrderedList() {
  const schema = getSchema();
  if (!schema || !schema.nodes.ordered_list) return;
  
  const orderedList = schema.nodes.ordered_list;
  const view = getEditorView();
  if (!view) return;
  
  const { state } = view;
  const { selection } = state;
  const { $from } = selection;
  
  // Check if we're already in an ordered list
  let inOrderedList = false;
  let depth = $from.depth;
  while (depth > 0) {
    const node = $from.node(depth);
    if (node.type.name === 'ordered_list') {
      inOrderedList = true;
      break;
    }
    if (node.type.name === 'list_item') {
      // Check parent
      const parent = $from.node(depth - 1);
      if (parent && parent.type.name === 'ordered_list') {
        inOrderedList = true;
        break;
      }
    }
    depth--;
  }
  
  if (inOrderedList) {
    // Unwrap: convert list items to paragraphs
    const tr = state.tr;
    const listItems = [];
    state.doc.nodesBetween($from.pos, selection.$to.pos, (node, pos) => {
      if (node.type.name === 'list_item') {
        listItems.push({ node, pos });
      }
    });
    
    if (listItems.length === 0) {
      // Find current list item
      depth = $from.depth;
      while (depth > 0) {
        const node = $from.node(depth);
        if (node.type.name === 'list_item') {
          listItems.push({ node, pos: $from.start(depth) - 1 });
          break;
        }
        depth--;
      }
    }
    
    listItems.reverse().forEach(({ node, pos }) => {
      const paragraph = state.schema.nodes.paragraph.create({}, node.content);
      tr.replaceWith(pos, pos + node.nodeSize, paragraph);
    });
    
    view.dispatch(tr);
  } else {
    // Wrap in list
    applyCommand(wrapInList(orderedList));
  }
}

// File menu functions
function toggleFileMenu() {
  showFileMenu.value = !showFileMenu.value;
}

function handleSave() {
  showFileMenu.value = false;
  const content = editorRef.value?.getContent() || editorContent.value;
  
  // If this is a non-custom app (from JSON config), save as modified version
  if (!props.isCustom && props.originalTitle) {
    // Save modified version with a special key
    const fileName = props.originalTitle.replace('.doc', '');
    const modifiedKey = `wordDocument_modified_${fileName}`;
    
    // Save document content to localStorage as modified version
    localStorage.setItem(modifiedKey, JSON.stringify({
      name: fileName,
      content: content,
      timestamp: Date.now(),
      isModified: true,
      originalTitle: props.originalTitle,
    }));
    
    alert(`Document saved!`);
    return;
  }
  
  // For custom icons, use existing logic
  // Use default name if no title is set
  const defaultName = 'Document';
  const fileName = defaultName;
  
  // Save document content
  localStorage.setItem(`wordDocument_${fileName}`, JSON.stringify({
    name: fileName,
    content: content,
    timestamp: Date.now(),
  }));
  
  // Create or update icon entry
  createOrUpdateWordIcon(fileName, content);
  
  alert('Document saved!');
}

function handleSaveAs() {
  showFileMenu.value = false;
  const fileName = prompt('Enter file name:', 'document');
  if (fileName) {
    const content = editorRef.value?.getContent() || editorContent.value;
    
    // Save document content
    localStorage.setItem(`wordDocument_${fileName}`, JSON.stringify({
      name: fileName,
      content: content,
      timestamp: Date.now(),
    }));
    
    // Create or update icon entry
    createOrUpdateWordIcon(fileName, content);
    
    alert(`Document saved as "${fileName}"!`);
  }
}

function createOrUpdateWordIcon(fileName, content) {
  // Load existing saved icons
  let savedIcons = [];
  try {
    const savedIconsJson = localStorage.getItem('savedWordIcons');
    if (savedIconsJson) {
      savedIcons = JSON.parse(savedIconsJson);
    }
  } catch (e) {
    console.warn('Failed to load saved icons', e);
  }
  
  // Create icon title with .doc extension
  const iconTitle = fileName.endsWith('.doc') ? fileName : `${fileName}.doc`;
  
  // Check if icon already exists
  const existingIndex = savedIcons.findIndex(icon => icon.title === iconTitle);
  
  const iconConfig = {
    title: iconTitle,
    'desktop-icon': '/images/resume/wordicon_destop.svg',
    icon: '/images/resume/wordIcon.png',
    app: 'Word',
    x: '10px',
    y: '150px',
    appProps: {
      content: content,
    },
    isCustom: true, // Flag to identify custom saved icons (not from JSON config)
    savedAt: Date.now(),
  };
  
  if (existingIndex !== -1) {
    // Update existing icon - preserve position and other properties
    const existingIcon = savedIcons[existingIndex];
    savedIcons[existingIndex] = {
      ...existingIcon, // Preserve all existing properties (including x, y position)
      ...iconConfig, // Override with new content and timestamp
      x: existingIcon.x || iconConfig.x, // Preserve existing position
      y: existingIcon.y || iconConfig.y, // Preserve existing position
      appProps: {
        ...existingIcon.appProps,
        content: content, // Update content
      },
    };
  } else {
    // Add new icon
    savedIcons.push(iconConfig);
  }
  
  // Save back to localStorage
  localStorage.setItem('savedWordIcons', JSON.stringify(savedIcons));
  
  // Emit event to refresh desktop icons
  window.dispatchEvent(new CustomEvent('saved-icons-updated'));
}

function handleNew() {
  if (confirm('Create a new document? Unsaved changes will be lost.')) {
    editorContent.value = '';
    if (editorView) {
      const schema = getSchema();
      if (schema) {
        const parser = DOMParser.fromSchema(schema);
        const tempDiv = document.createElement('div');
        const state = EditorState.create({
          schema,
          plugins: editorView.state.plugins,
        });
        editorView.updateState(state);
      }
    }
  }
}

function handleOpen() {
  const fileName = prompt('Enter file name to open:', 'document');
  if (fileName) {
    const saved = localStorage.getItem(`wordDocument_${fileName}`);
    if (saved) {
      const data = JSON.parse(saved);
      editorContent.value = data.content;
    } else {
      alert('File not found!');
    }
  }
}

function handleCut() {
  document.execCommand('cut');
}

function handleCopy() {
  document.execCommand('copy');
}

function handlePaste() {
  document.execCommand('paste');
}

function handleUndo() {
  const view = getEditorView();
  if (!view) return;
  applyCommand(undo);
}

function handleRedo() {
  const view = getEditorView();
  if (!view) return;
  applyCommand(redo);
}

function handleContentUpdate(newContent) {
  editorContent.value = newContent;
}

function handleEditorFocus() {
  cubeStore.toggleKeyRotate(false);
}

function handleEditorBlur() {
  cubeStore.toggleKeyRotate(true);
}

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.menu-item')) {
    showFileMenu.value = false;
  }
});
</script>

<style lang="less" scoped>
.word-app {
  display: flex;
  flex-direction: column;
  height: 100%;
  background: #ece9d8;
  font-family: 'MS Sans Serif', sans-serif;
}

.menu-bar {
  display: flex;
  background: #d4d0c8;
  border-bottom: 1px solid #808080;
  padding: 2px 0;
  font-size: 11px;
  user-select: none;
  
  .menu-item {
    padding: 4px 12px;
    cursor: pointer;
    position: relative;
    border: 1px solid transparent;
    
    &:hover {
      background: #316ac5;
      color: white;
      border: 1px solid #003c74;
    }
    
    .menu-dropdown {
      position: absolute;
      top: 100%;
      left: 0;
      background: #d4d0c8;
      border: 1px solid #808080;
      box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
      z-index: 1000;
      min-width: 150px;
      
      .menu-option {
        padding: 4px 20px;
        cursor: pointer;
        
        &:hover {
          background: #316ac5;
          color: white;
        }
      }
    }
  }
}

.toolbar {
  display: flex;
  align-items: center;
  background: #d4d0c8;
  border-bottom: 1px solid #808080;
  padding: 4px;
  gap: 2px;
  
  .toolbar-btn {
    background: #d4d0c8;
    border: 1px solid #808080;
    border-top-color: #ffffff;
    border-left-color: #ffffff;
    padding: 4px 8px;
    cursor: pointer;
    font-size: 12px;
    min-width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    
    &:hover:not(:disabled) {
      background: #e8e4d8;
    }
    
    &:active:not(:disabled) {
      border-top-color: #808080;
      border-left-color: #808080;
      border-bottom-color: #ffffff;
      border-right-color: #ffffff;
    }
    
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    &.active {
      background: #c0c0c0;
      border-top-color: #808080;
      border-left-color: #808080;
      border-bottom-color: #ffffff;
      border-right-color: #ffffff;
    }
    
    .icon {
      font-size: 14px;
    }
    
    strong, em, u {
      font-weight: bold;
      font-style: normal;
      text-decoration: none;
    }
  }
  
  .toolbar-separator {
    width: 1px;
    height: 20px;
    background: #808080;
    margin: 0 4px;
  }
  
  .font-selector,
  .font-size-selector {
    background: white;
    border: 1px solid #808080;
    padding: 2px 4px;
    font-size: 11px;
    height: 22px;
    cursor: pointer;
  }
  
  .font-selector {
    width: 200px;
  }
  
  .font-size-selector {
    width: 50px;
  }
}

.editor-wrapper {
  flex: 1;
  overflow: auto;
}
</style>
