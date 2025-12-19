import { ref } from 'vue';
import { toggleMark } from 'prosemirror-commands';
import { wrapInList } from 'prosemirror-schema-list';
import { undo, redo, undoDepth, redoDepth } from 'prosemirror-history';

/**
 * Composable for managing editor commands and state
 */
export function useEditorCommands(editorRef) {
  const isBold = ref(false);
  const isItalic = ref(false);
  const isUnderline = ref(false);
  const isLeftAlign = ref(true);
  const isCenterAlign = ref(false);
  const isRightAlign = ref(false);
  const isJustifyAlign = ref(false);
  const isBulletList = ref(false);
  const isOrderedList = ref(false);
  const canUndo = ref(false);
  const canRedo = ref(false);
  const selectedFont = ref('Times New Roman');
  const selectedFontSize = ref(12);

  function getEditorView() {
    if (!editorRef.value) return null;
    return editorRef.value.getEditorView();
  }

  function getSchema() {
    if (!editorRef.value) return null;
    return editorRef.value.getSchema();
  }

  function applyCommand(command) {
    const view = getEditorView();
    if (!view) return false;
    
    const { state, dispatch } = view;
    return command(state, dispatch);
  }

  function updateToolbarState() {
    const view = getEditorView();
    if (!view) return;
    
    const { state } = view;
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
    
    // Check alignment
    if (editorRef.value && editorRef.value.getTextAlign) {
      const currentAlign = editorRef.value.getTextAlign();
      isLeftAlign.value = currentAlign === 'left' || currentAlign === null;
      isCenterAlign.value = currentAlign === 'center';
      isRightAlign.value = currentAlign === 'right';
      isJustifyAlign.value = currentAlign === 'justify';
    }
    
    // Check list types
    const node = $from.node($from.depth);
    isBulletList.value = node.type.name === 'bullet_list';
    isOrderedList.value = node.type.name === 'ordered_list';
    
    // Check undo/redo
    canUndo.value = undoDepth(state) > 0;
    canRedo.value = redoDepth(state) > 0;
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
    
    const existingMark = fontFamilyMark.isInSet($from.marks());
    if (existingMark && existingMark.attrs.family === selectedFont.value) {
      tr.removeMark($from.pos, $to.pos, fontFamilyMark);
    } else {
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
    
    const existingMark = fontSizeMark.isInSet($from.marks());
    if (existingMark && existingMark.attrs.size === fontSizeValue) {
      tr.removeMark($from.pos, $to.pos, fontSizeMark);
    } else {
      tr.removeMark($from.pos, $to.pos, fontSizeMark);
      tr.addMark($from.pos, $to.pos, fontSizeMark.create({ size: fontSizeValue }));
    }
    
    dispatch(tr);
  }

  // Alignment functions
  function alignLeft() {
    if (editorRef.value && editorRef.value.setTextAlign) {
      editorRef.value.setTextAlign('left');
    }
  }

  function alignCenter() {
    if (editorRef.value && editorRef.value.setTextAlign) {
      editorRef.value.setTextAlign('center');
    }
  }

  function alignRight() {
    if (editorRef.value && editorRef.value.setTextAlign) {
      editorRef.value.setTextAlign('right');
    }
  }

  function alignJustify() {
    if (editorRef.value && editorRef.value.setTextAlign) {
      editorRef.value.setTextAlign('justify');
    }
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
    
    let inBulletList = false;
    let depth = $from.depth;
    while (depth > 0) {
      const node = $from.node(depth);
      if (node.type.name === 'bullet_list') {
        inBulletList = true;
        break;
      }
      if (node.type.name === 'list_item') {
        const parent = $from.node(depth - 1);
        if (parent && parent.type.name === 'bullet_list') {
          inBulletList = true;
          break;
        }
      }
      depth--;
    }
    
    if (inBulletList) {
      const tr = state.tr;
      const listItems = [];
      state.doc.nodesBetween($from.pos, selection.$to.pos, (node, pos) => {
        if (node.type.name === 'list_item') {
          listItems.push({ node, pos });
        }
      });
      
      if (listItems.length === 0) {
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
    
    let inOrderedList = false;
    let depth = $from.depth;
    while (depth > 0) {
      const node = $from.node(depth);
      if (node.type.name === 'ordered_list') {
        inOrderedList = true;
        break;
      }
      if (node.type.name === 'list_item') {
        const parent = $from.node(depth - 1);
        if (parent && parent.type.name === 'ordered_list') {
          inOrderedList = true;
          break;
        }
      }
      depth--;
    }
    
    if (inOrderedList) {
      const tr = state.tr;
      const listItems = [];
      state.doc.nodesBetween($from.pos, selection.$to.pos, (node, pos) => {
        if (node.type.name === 'list_item') {
          listItems.push({ node, pos });
        }
      });
      
      if (listItems.length === 0) {
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
      applyCommand(wrapInList(orderedList));
    }
  }

  function handleUndo() {
    applyCommand(undo);
  }

  function handleRedo() {
    applyCommand(redo);
  }

  return {
    // State
    isBold,
    isItalic,
    isUnderline,
    isLeftAlign,
    isCenterAlign,
    isRightAlign,
    isJustifyAlign,
    isBulletList,
    isOrderedList,
    canUndo,
    canRedo,
    selectedFont,
    selectedFontSize,
    // Functions
    updateToolbarState,
    toggleBold,
    toggleItalic,
    toggleUnderline,
    applyFont,
    applyFontSize,
    alignLeft,
    alignCenter,
    alignRight,
    alignJustify,
    toggleBulletList,
    toggleOrderedList,
    handleUndo,
    handleRedo,
  };
}
