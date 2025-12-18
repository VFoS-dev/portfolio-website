<template>
  <div class="paged-editor">
    <div ref="editorContainer" class="editor-container"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue';
import { EditorState, Plugin } from 'prosemirror-state';
import { EditorView } from 'prosemirror-view';
import { Schema, DOMParser, DOMSerializer, Fragment } from 'prosemirror-model';
import { schema } from 'prosemirror-schema-basic';
import { addListNodes } from 'prosemirror-schema-list';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, toggleMark, selectAll } from 'prosemirror-commands';
import { history, redo, undo } from 'prosemirror-history';

const props = defineProps({
  modelValue: {
    type: String,
    default: '',
  },
  topMargin: {
    type: String,
    default: '1in',
  },
  bottomMargin: {
    type: String,
    default: '1in',
  },
  pageSpacing: {
    type: String,
    default: '40px',
  },
});

const emit = defineEmits(['update:modelValue', 'focus', 'blur']);

const editorContainer = ref(null);
let editorView = null;

// Create schema with page node
const baseMarks = schema.spec.marks;
const baseNodes = addListNodes(schema.spec.nodes, 'paragraph block*', 'block');

// Define page node that contains block content
const pageNodeSpec = {
  content: 'block*',
  group: 'block',
  defining: true,
  isolating: true,
  attrs: {
    id: { default: 0 },
  },
  parseDOM: [{ tag: 'div.page-node' }],
  toDOM: (node) => ['div', { class: 'page-node', 'data-page-id': node.attrs.id }, 0],
};

const mySchema = new Schema({
  nodes: baseNodes.append({
    page: pageNodeSpec,
  }),
  marks: baseMarks.addToEnd('underline', {
    parseDOM: [{ tag: 'u' }, { style: 'text-decoration', getAttrs: value => value === 'underline' && null }],
    toDOM: () => ['u', 0],
  }),
});

const boldMark = mySchema.marks.strong;
const italicMark = mySchema.marks.em;
const codeMark = mySchema.marks.code;

function parseMargin(margin) {
  if (margin.endsWith('in')) {
    return parseFloat(margin) * 96;
  } else if (margin.endsWith('px')) {
    return parseFloat(margin);
  } else if (margin.endsWith('pt')) {
    return parseFloat(margin) * 1.33;
  }
  return 96;
}

const PAGE_HEIGHT = 11 * 96; // 11 inches

function getPageContentHeight() {
  const topMarginPx = parseMargin(props.topMargin);
  const bottomMarginPx = parseMargin(props.bottomMargin);
  return PAGE_HEIGHT - topMarginPx - bottomMarginPx;
}

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

function createEditorState(content) {
  const parser = DOMParser.fromSchema(mySchema);
  
  const formattingKeymap = {
    'Mod-z': undo,
    'Mod-y': redo,
    'Mod-Shift-z': redo,
    'Mod-b': boldMark ? toggleMark(boldMark) : () => false,
    'Mod-i': italicMark ? toggleMark(italicMark) : () => false,
    'Mod-`': codeMark ? toggleMark(codeMark) : () => false,
    'Mod-a': selectAll,
  };
  
  if (mySchema.marks.underline) {
    formattingKeymap['Mod-u'] = toggleMark(mySchema.marks.underline);
  }
  
  // Custom handler for backspace on empty pages
  const backspaceHandler = (state) => {
    const { selection, doc } = state;
    const { $from } = selection;
    
    // Check if we're at the start of an empty page
    if ($from.parent.type.name === 'page') {
      const pageContent = $from.parent.content;
      const isEmpty = pageContent.size === 0 || (pageContent.size === 1 && pageContent.firstChild?.textContent.trim() === '');
      const atStart = $from.parentOffset === 0 && selection.from === $from.start($from.depth) + 1;
      
      // Count total pages
      let pageCount = 0;
      doc.descendants((node) => {
        if (node.type.name === 'page') pageCount++;
      });
      
      if (isEmpty && atStart && pageCount > 1) {
        // Remove empty page
        setTimeout(() => {
          removeEmptyPage(state, $from);
        }, 0);
        return true;
      }
    }
    
    return false;
  };
  
  formattingKeymap['Backspace'] = backspaceHandler;
  
  const plugins = [
    history(),
    keymap(formattingKeymap),
    keymap(baseKeymap),
    createPaginationPlugin(),
  ];
  
  if (content && content.trim()) {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const parsed = parser.parse(tempDiv);
      
      let doc;
      if (parsed.content.firstChild?.type.name === 'page') {
        doc = parsed;
      } else {
        const pageNode = mySchema.nodes.page.create({ id: generateId() }, parsed.content);
        doc = mySchema.nodes.doc.create({}, [pageNode]);
      }
      
      return EditorState.create({
        doc,
        schema: mySchema,
        plugins,
      });
    } catch (e) {
      console.warn('Failed to parse content', e);
    }
  }
  
  const emptyPage = mySchema.nodes.page.create({ id: generateId() }, [
    mySchema.nodes.paragraph.create()
  ]);
  const emptyDoc = mySchema.nodes.doc.create({}, [emptyPage]);
  
  return EditorState.create({
    doc: emptyDoc,
    schema: mySchema,
    plugins,
  });
}

function createPaginationPlugin() {
  let checkTimeout = null;
  
  function checkAndSplitPages(state) {
    if (!editorView) return;
    
    const tr = state.tr;
    const doc = state.doc;
    const maxHeight = getPageContentHeight();
    
    // First check for pages that can be merged
    let prevPage = null;
    let prevPageOffset = 0;
    
    doc.forEach((node, offset) => {
      if (node.type.name === 'page' && prevPage) {
        if (canMergePages(prevPage, node, maxHeight)) {
          const mergeResult = mergePages(tr, prevPage, node, prevPageOffset);
          if (mergeResult) {
            editorView.dispatch(mergeResult);
            const content = getHTMLContent();
            emit('update:modelValue', content);
            return false; // Break - will be called again for cascading
          }
        }
      }
      if (node.type.name === 'page') {
        prevPage = node;
        prevPageOffset = offset;
      }
    });
    
    // Then check for overflowing pages
    let overflowPage = null;
    let pageOffset = 0;
    let pageElement = null;
    
    doc.forEach((node, offset) => {
      if (node.type.name === 'page' && !overflowPage) {
        const element = editorView.dom.querySelector(`[data-page-id="${node.attrs.id}"]`);
        
        if (element) {
          // Calculate actual content height
          const computedStyle = window.getComputedStyle(element);
          const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
          const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
          const scrollHeight = element.scrollHeight;
          const actualContentHeight = scrollHeight - paddingTop - paddingBottom;
          
          if (actualContentHeight > maxHeight) {
            overflowPage = node;
            pageOffset = offset;
            pageElement = element;
            return false; // Break
          }
        }
      }
    });
    
    if (!overflowPage || !pageElement) {
      return; // No overflow found
    }
    
    // Find where to split
    const splitInfo = findSplitPoint(overflowPage, maxHeight, pageElement);
    if (!splitInfo) {
      return; // Can't split
    }
    
    // Perform the split (this will check for merges automatically)
    const result = splitPageAt(tr, overflowPage, splitInfo, pageOffset);
    if (result) {
      // Dispatch the transaction
      editorView.dispatch(result);
      const content = getHTMLContent();
      emit('update:modelValue', content);
    }
  }
  
  return new Plugin({
    appendTransaction(transactions, oldState, newState) {
      // Only process if document changed
      if (!transactions.some(tr => tr.docChanged)) {
        return null;
      }
      
      if (!editorView) {
        return null;
      }
      
      // Clear any pending timeout
      if (checkTimeout) {
        clearTimeout(checkTimeout);
      }
      
      // Schedule check after DOM updates
      // We need to wait for the DOM to be updated before we can measure
      checkTimeout = setTimeout(() => {
        checkTimeout = null;
        checkAndSplitPages(newState);
      }, 0);
      
      return null;
    },
    
    view(view) {
      editorView = view;
      return {
        destroy() {
          if (checkTimeout) {
            clearTimeout(checkTimeout);
          }
        }
      };
    }
  });
}

function findSplitPoint(pageNode, maxHeight, pageElement) {
  const pageContent = pageNode.content;
  if (pageContent.childCount === 0) {
    return null;
  }
  
  // Get all direct child elements of the page (these correspond to block nodes)
  const childElements = Array.from(pageElement.children);
  
  // If no child elements, can't split
  if (childElements.length === 0) {
    return null;
  }
  
  // Measure accumulated height as we iterate through nodes
  let accumulatedHeight = 0;
  let splitIndex = -1;
  
  // Iterate through content nodes and their corresponding DOM elements
  for (let i = 0; i < pageContent.childCount && i < childElements.length; i++) {
    const element = childElements[i];
    const computedStyle = window.getComputedStyle(element);
    
    // Get the full height including margins
    const height = element.offsetHeight;
    const marginTop = parseFloat(computedStyle.marginTop) || 0;
    const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
    const nodeHeight = height + marginTop + marginBottom;
    
    // Check if adding this node would exceed the max height
    if (accumulatedHeight + nodeHeight > maxHeight) {
      // We need to split before this node
      // But we need at least one node on the first page
      if (i > 0) {
        splitIndex = i;
        break;
      } else {
        // First node is too tall - we'll split it anyway
        splitIndex = 1;
        break;
      }
    }
    
    accumulatedHeight += nodeHeight;
  }
  
  // If we didn't find a split point but content still overflows, split at midpoint
  if (splitIndex === -1 && pageContent.childCount > 1) {
    splitIndex = Math.max(1, Math.floor(pageContent.childCount / 2));
  }
  
  if (splitIndex === -1 || splitIndex === 0) {
    return null; // Can't split
  }
  
  // Calculate the position within the page
  let pos = 1; // Start after page opening tag
  for (let j = 0; j < splitIndex; j++) {
    pos += pageContent.child(j).nodeSize;
  }
  
  return { pos, index: splitIndex };
}

function canMergePages(firstPage, secondPage, maxHeight) {
  if (!firstPage || !secondPage) return false;
  
  // Get combined content
  const firstContent = firstPage.content;
  const secondContent = secondPage.content;
  
  // Estimate combined height by checking DOM if available
  if (editorView) {
    const firstElement = editorView.dom.querySelector(`[data-page-id="${firstPage.attrs.id}"]`);
    const secondElement = editorView.dom.querySelector(`[data-page-id="${secondPage.attrs.id}"]`);
    
    if (firstElement && secondElement) {
      const firstStyle = window.getComputedStyle(firstElement);
      const secondStyle = window.getComputedStyle(secondElement);
      
      const firstPaddingTop = parseFloat(firstStyle.paddingTop) || 0;
      const firstPaddingBottom = parseFloat(firstStyle.paddingBottom) || 0;
      const firstContentHeight = firstElement.scrollHeight - firstPaddingTop - firstPaddingBottom;
      
      const secondPaddingTop = parseFloat(secondStyle.paddingTop) || 0;
      const secondPaddingBottom = parseFloat(secondStyle.paddingBottom) || 0;
      const secondContentHeight = secondElement.scrollHeight - secondPaddingTop - secondPaddingBottom;
      
      // Check if combined would fit
      return (firstContentHeight + secondContentHeight) <= maxHeight;
    }
  }
  
  // Fallback: estimate based on node count
  const estimatedHeight = (firstContent.childCount + secondContent.childCount) * 20; // Rough estimate
  return estimatedHeight <= maxHeight;
}

function mergePages(tr, firstPage, secondPage, firstPageOffset) {
  if (!firstPage || !secondPage) return null;
  
  // Combine content from both pages
  const firstContent = firstPage.content;
  const secondContent = secondPage.content;
  
  const combinedNodes = [];
  for (let i = 0; i < firstContent.childCount; i++) {
    combinedNodes.push(firstContent.child(i));
  }
  for (let i = 0; i < secondContent.childCount; i++) {
    combinedNodes.push(secondContent.child(i));
  }
  
  // Create merged page
  const mergedPage = mySchema.nodes.page.create(
    { id: firstPage.attrs.id },
    combinedNodes.length > 0 ? combinedNodes : [mySchema.nodes.paragraph.create()]
  );
  
  // Calculate positions
  const firstPageStartPos = firstPageOffset;
  const secondPageStartPos = firstPageOffset + firstPage.nodeSize;
  const secondPageEndPos = secondPageStartPos + secondPage.nodeSize;
  
  // Replace both pages with the merged page
  tr.replaceWith(firstPageStartPos, secondPageEndPos, mergedPage);
  
  return tr;
}

function splitPageAt(tr, pageNode, splitInfo, pageOffset) {
  const pageContent = pageNode.content;
  
  // Build arrays of nodes for first and second half
  const firstHalfNodes = [];
  const secondHalfNodes = [];
  
  // Iterate through content nodes and split at the specified index
  for (let i = 0; i < pageContent.childCount; i++) {
    if (i < splitInfo.index) {
      firstHalfNodes.push(pageContent.child(i));
    } else {
      secondHalfNodes.push(pageContent.child(i));
    }
  }
  
  // If second half is empty, nothing to split
  if (secondHalfNodes.length === 0) {
    return null;
  }
  
  // Generate new page ID for the new page
  const newPageId = generateId();
  
  // Create the updated original page with first half
  const updatedPage = mySchema.nodes.page.create(
    { id: pageNode.attrs.id },
    firstHalfNodes.length > 0 ? firstHalfNodes : [mySchema.nodes.paragraph.create()]
  );
  
  // Create new page with second half
  const newPage = mySchema.nodes.page.create(
    { id: newPageId },
    secondHalfNodes
  );
  
  // Calculate positions
  const pageStartPos = pageOffset;
  const pageEndPos = pageOffset + pageNode.nodeSize;
  
  // Check if we can merge the new page with the next page
  const doc = tr.doc;
  let nextPage = null;
  let nextPageOffset = 0;
  
  // Find the next page after the current one
  let foundCurrent = false;
  doc.forEach((node, offset) => {
    if (node === pageNode) {
      foundCurrent = true;
      return;
    }
    if (foundCurrent && node.type.name === 'page' && !nextPage) {
      nextPage = node;
      nextPageOffset = offset;
      return false; // Break
    }
  });
  
  // If there's a next page and we can merge, merge instead of creating new page
  const maxHeight = getPageContentHeight();
  if (nextPage && canMergePages(newPage, nextPage, maxHeight)) {
    // Merge the new page with the next page
    const mergedNodes = [...secondHalfNodes];
    for (let i = 0; i < nextPage.content.childCount; i++) {
      mergedNodes.push(nextPage.content.child(i));
    }
    
    const mergedNextPage = mySchema.nodes.page.create(
      { id: nextPage.attrs.id },
      mergedNodes
    );
    
    // Replace current page and next page with updated page and merged page
    const nextPageEndPos = nextPageOffset + nextPage.nodeSize;
    const fragment = Fragment.from([updatedPage, mergedNextPage]);
    tr.replaceWith(pageStartPos, nextPageEndPos, fragment);
  } else {
    // Replace the old page with both the updated page and new page
    const fragment = Fragment.from([updatedPage, newPage]);
    tr.replaceWith(pageStartPos, pageEndPos, fragment);
  }
  
  return tr;
}

function removeEmptyPage(state, $from) {
  if (!editorView) return;
  
  const { tr } = state;
  const pageNode = $from.node($from.depth);
  const pagePos = $from.start($from.depth) - 1;
  
  let pageCount = 0;
  state.doc.descendants((node) => {
    if (node.type.name === 'page') pageCount++;
  });
  
  if (pageCount > 1) {
    tr.delete(pagePos, pagePos + pageNode.nodeSize);
    editorView.dispatch(tr);
  }
}

function validateAllPages() {
  if (!editorView) return;
  
  // Use a recursive approach to check and fix pages
  // This allows DOM to update between iterations
  function checkNextPage(iteration = 0) {
    if (iteration >= 200) {
      // Prevent infinite loops
      return;
    }
    
    const state = editorView.state;
    const doc = state.doc;
    const maxHeight = getPageContentHeight();
    let hasChanges = false;
    
    // First, check for pages that can be merged
    let prevPage = null;
    let prevPageOffset = 0;
    
    doc.forEach((node, offset) => {
      if (node.type.name === 'page' && !hasChanges) {
        if (prevPage) {
          // Check if previous page and current page can be merged
          if (canMergePages(prevPage, node, maxHeight)) {
            const tr = state.tr;
            const result = mergePages(tr, prevPage, node, prevPageOffset);
            if (result) {
              editorView.dispatch(result);
              const content = getHTMLContent();
              emit('update:modelValue', content);
              hasChanges = true;
              
              // Wait for DOM update and continue
              requestAnimationFrame(() => {
                setTimeout(() => {
                  checkNextPage(iteration + 1);
                }, 50);
              });
              return false; // Break
            }
          }
        }
        
        prevPage = node;
        prevPageOffset = offset;
      }
    });
    
    // If we merged pages, continue checking
    if (hasChanges) {
      return;
    }
    
    // Now check for overflowing pages
    let overflowPage = null;
    let pageOffset = 0;
    let pageElement = null;
    
    doc.forEach((node, offset) => {
      if (node.type.name === 'page' && !overflowPage) {
        const element = editorView.dom.querySelector(`[data-page-id="${node.attrs.id}"]`);
        
        if (element) {
          // Calculate actual content height
          const computedStyle = window.getComputedStyle(element);
          const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
          const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
          const scrollHeight = element.scrollHeight;
          const actualContentHeight = scrollHeight - paddingTop - paddingBottom;
          
          if (actualContentHeight > maxHeight) {
            overflowPage = node;
            pageOffset = offset;
            pageElement = element;
            return false; // Break
          }
        }
      }
    });
    
    if (!overflowPage || !pageElement) {
      // No overflow found, we're done
      return;
    }
    
    // Find where to split
    const splitInfo = findSplitPoint(overflowPage, maxHeight, pageElement);
    if (!splitInfo) {
      // Can't split this page, we're done
      return;
    }
    
    // Perform the split
    const tr = state.tr;
    const result = splitPageAt(tr, overflowPage, splitInfo, pageOffset);
    if (result) {
      // Dispatch the transaction
      editorView.dispatch(result);
      
      // Update content
      const content = getHTMLContent();
      emit('update:modelValue', content);
      
      // Wait for DOM to update, then check next page (cascade)
      requestAnimationFrame(() => {
        setTimeout(() => {
          checkNextPage(iteration + 1);
        }, 50);
      });
    }
  }
  
  // Start checking
  checkNextPage();
}

function getHTMLContent() {
  if (!editorView) return '';
  
  const serializer = DOMSerializer.fromSchema(mySchema);
  const fragment = serializer.serializeFragment(editorView.state.doc.content);
  const wrapper = document.createElement('div');
  wrapper.appendChild(fragment);
  
  const pageNodes = wrapper.querySelectorAll('.page-node');
  let allContent = '';
  
  pageNodes.forEach((pageNode) => {
    allContent += pageNode.innerHTML;
  });
  
  return allContent;
}

onMounted(() => {
  nextTick(() => {
    if (!editorContainer.value) return;
    
    const state = createEditorState(props.modelValue || '');
    editorView = new EditorView(editorContainer.value, {
      state,
      dispatchTransaction(transaction) {
        const newState = editorView.state.apply(transaction);
        editorView.updateState(newState);
        
        if (transaction.docChanged) {
          const content = getHTMLContent();
          emit('update:modelValue', content);
        }
      },
    });
    
    editorView.dom.addEventListener('focus', () => {
      emit('focus');
    });
    
    editorView.dom.addEventListener('blur', () => {
      emit('blur');
    });
    
    // Validate all pages after DOM is rendered
    requestAnimationFrame(() => {
      setTimeout(() => {
        validateAllPages();
      }, 100);
    });
  });
});

onBeforeUnmount(() => {
  if (editorView) {
    editorView.destroy();
  }
});

watch(
  () => props.modelValue,
  (newValue) => {
    if (!editorView) return;
    
    const currentContent = getHTMLContent();
    if (currentContent !== newValue) {
      const newState = createEditorState(newValue || '');
      editorView.updateState(newState);
      
      // Validate all pages after content is loaded
      requestAnimationFrame(() => {
        setTimeout(() => {
          validateAllPages();
        }, 100);
      });
    }
  }
);
</script>

<style lang="less" scoped>
.paged-editor {
  background: #ece9d8;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: v-bind('props.pageSpacing');
}

.editor-container {
  width: 100%;
  max-width: 8.5in;
  display: flex;
  flex-direction: column;
  gap: v-bind('props.pageSpacing');
  
  :deep(.ProseMirror) {
    outline: none;
    
    .page-node {
      width: 100%;
      max-width: 8.5in;
      min-width: 8.5in;
      min-height: 11in;
      max-height: 11in;
      background: white;
      box-shadow: 4px 4px 0 black;
      border: 1px solid black;
      font-family: 'Times New Roman', Times, serif;
      font-size: 12pt;
      line-height: 1.5;
      box-sizing: border-box;
      position: relative;
      padding-top: v-bind('props.topMargin');
      padding-bottom: v-bind('props.bottomMargin');
      padding-left: 1in;
      padding-right: 1in;
      margin-bottom: v-bind('props.pageSpacing');
      
      p {
        margin: 0;
        margin-bottom: 0.25em;
        
        &:first-child {
          margin-top: 0;
        }
        
        &:last-child {
          margin-bottom: 0;
        }
      }
      
      h1, h2, h3, h4, h5, h6 {
        margin: 0.5em 0;
        
        &:first-child {
          margin-top: 0;
        }
      }
      
      ul, ol {
        margin: 0.5em 0;
        padding-left: 2em;
      }
      
      li {
        margin: 0.25em 0;
      }
      
      blockquote {
        border-left: 3px solid #ccc;
        margin: 0.5em 0;
        padding-left: 1em;
        color: #666;
        font-style: italic;
      }
      
      code {
        background: #f4f4f4;
        padding: 2px 4px;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 11pt;
      }
      
      pre {
        background: #f4f4f4;
        padding: 1em;
        border-radius: 4px;
        overflow-x: auto;
        margin: 0.5em 0;
        
        code {
          background: none;
          padding: 0;
        }
      }
      
      strong {
        font-weight: bold;
      }
      
      em {
        font-style: italic;
      }
      
      u {
        text-decoration: underline;
      }
    }
  }
}
</style>