import { schema as basicSchema } from 'prosemirror-schema-basic';
import { addListNodes, sinkListItem, splitListItem, liftListItem } from 'prosemirror-schema-list';
import { keymap } from 'prosemirror-keymap';
import { baseKeymap, toggleMark, selectAll } from 'prosemirror-commands';
import { history, redo, undo } from 'prosemirror-history';
import { EditorState } from 'prosemirror-state';
import { DOMParser, Schema, Fragment } from 'prosemirror-model';
import { TextSelection } from 'prosemirror-state';
import { pageNode, paragraphNode } from './nodes.js';
import { underlineMark, fontFamilyMark, fontSizeMark } from './marks.js';
import { clipboardPlugin, paginationPlugin } from './plugins.js';
import { generateId as defaultGenerateId, getPageContentHeight as defaultGetPageContentHeight, isWrappedIn, listToList, getCurrentNodeType, exitNodeToParagraph } from './helpers.js';
import { modifyParentNode } from './commands.js';

// Create schema with page node and custom marks
const baseMarks = basicSchema.spec.marks;
const baseNodes = addListNodes(basicSchema.spec.nodes, 'paragraph block*', 'block');

// Get the doc node spec and override it to only allow page nodes
const originalDocSpec = basicSchema.spec.nodes.get('doc');
const docNodeSpec = {
  ...originalDocSpec.spec,
  content: 'page+', // Only allow page nodes, at least one required
};

// Create nodes object with overridden doc node
const customNodes = baseNodes.remove('doc').addToEnd('doc', docNodeSpec).append({
  page: pageNode,
  paragraph: paragraphNode,
});

export const pagedEditorSchema = new Schema({
  nodes: customNodes,
  marks: baseMarks
    .addToEnd('underline', underlineMark)
    .addToEnd('fontFamily', fontFamilyMark)
    .addToEnd('fontSize', fontSizeMark),
});

/**
 * Creates an EditorState for the paged editor
 * @param {string} content - HTML content string
 * @param {Object} options - Configuration options
 * @param {Function} options.generateId - Function to generate page IDs
 * @param {Function} options.getPageContentHeight - Function to get max page content height
 * @param {EditorView} options.editorViewRef - Reference to editor view
 * @param {Function} options.onContentChange - Callback when content changes
 * @returns {EditorState}
 */
export function getState(content = '', { generateId, getPageContentHeight, editorViewRef, onContentChange } = {}) {
  const parser = DOMParser.fromSchema(pagedEditorSchema);
  
  const boldMark = pagedEditorSchema.marks.strong;
  const italicMark = pagedEditorSchema.marks.em;
  const codeMark = pagedEditorSchema.marks.code;
  
  const formattingKeymap = {
    'Mod-z': undo,
    'Mod-y': redo,
    'Mod-Shift-z': redo,
    'Mod-b': boldMark ? toggleMark(boldMark) : () => false,
    'Mod-i': italicMark ? toggleMark(italicMark) : () => false,
    'Mod-`': codeMark ? toggleMark(codeMark) : () => false,
    'Mod-a': selectAll,
    'Mod-Shift-7': listToList('bullet_list'),
    'Mod-Shift-8': listToList('ordered_list'),
    Tab(state, dispatch, view) {
      if (isWrappedIn('list_item')(state)) {
        return sinkListItem(pagedEditorSchema.nodes.list_item)(state, dispatch, view);
      }
    },
    'Shift-Tab': liftListItem(pagedEditorSchema.nodes.list_item),
    Enter(state, dispatch, view) {
      if (isWrappedIn('list_item')(state)) {
        if (!splitListItem(pagedEditorSchema.nodes.list_item)(state, dispatch, view)) {
          liftListItem(pagedEditorSchema.nodes.list_item)(state, dispatch, view);
        }
        return true;
      }

      // If not in a paragraph, exit to paragraph
      if (getCurrentNodeType(state).name !== 'paragraph') {
        return exitNodeToParagraph(state, dispatch);
      }

      // Always split into paragraph - manually implement to ensure correct behavior
      if (dispatch) {
        const { $from } = state.selection;
        const { paragraph } = state.schema.nodes;
        const tr = state.tr;
        
        // Get the current paragraph node and its position
        const paragraphPos = $from.before($from.depth);
        const paragraphNode = $from.parent;
        const offset = $from.parentOffset;
        
        // Split the paragraph at the cursor position
        if (offset === 0 && paragraphNode.content.size === 0) {
          // Empty paragraph at start - just create a new empty paragraph before it
          const newParagraph = paragraph.create();
          tr.insert(paragraphPos, newParagraph);
          tr.setSelection(TextSelection.near(tr.doc.resolve(paragraphPos + 1)));
        } else if (offset === paragraphNode.content.size) {
          // At end of paragraph - create new paragraph after
          const afterPos = $from.after($from.depth);
          const newParagraph = paragraph.create();
          tr.insert(afterPos, newParagraph);
          tr.setSelection(TextSelection.near(tr.doc.resolve(afterPos + 1)));
        } else {
          // In the middle - split the paragraph
          const contentAfter = paragraphNode.content.cut(offset);
          const contentBefore = paragraphNode.content.cut(0, offset);
          
          // Create new paragraph with content after cursor
          const newParagraph = paragraph.create({}, contentAfter);
          
          // Replace current paragraph with content before cursor
          const beforePos = $from.before($from.depth);
          const afterPos = $from.after($from.depth);
          const updatedParagraph = paragraph.create({}, contentBefore);
          
          // Replace the paragraph and insert the new one
          tr.replaceWith(beforePos, afterPos, updatedParagraph);
          tr.insert(afterPos, newParagraph);
          
          // Set cursor to start of new paragraph
          tr.setSelection(TextSelection.near(tr.doc.resolve(afterPos + 1)));
        }
        
        dispatch(tr);
        return true;
      }
      
      return false;
    },
    'Shift-Enter': baseKeymap.Enter,
  };
  
  if (pagedEditorSchema.marks.underline) {
    formattingKeymap['Mod-u'] = toggleMark(pagedEditorSchema.marks.underline);
  }
  
  // Helper function to check if a page is empty
  function isPageEmpty(pageNode) {
    if (!pageNode || pageNode.type.name !== 'page') return false;
    const content = pageNode.content;
    if (content.size === 0) return true;
    // Check if all children are empty paragraphs
    let allEmpty = true;
    for (let i = 0; i < content.childCount; i++) {
      const child = content.child(i);
      if (child.type.name === 'paragraph') {
        if (child.textContent.trim() !== '') {
          allEmpty = false;
          break;
        }
      } else {
        // If there's any non-paragraph content, page is not empty
        allEmpty = false;
        break;
      }
    }
    return allEmpty;
  }

  // Helper function to count pages in document
  function countPages(doc) {
    let count = 0;
    doc.descendants((node) => {
      if (node.type.name === 'page') count++;
    });
    return count;
  }

  // Custom handler for backspace on empty pages
  const backspaceHandler = (state, dispatch) => {
    const { selection, doc } = state;
    const { $from } = selection;
    
    // Only handle empty page deletion when selection is empty (cursor only, no text selected)
    if (!selection.empty) {
      return false; // Let default backspace handler work for text selection
    }
    
    // Find the page node we're in
    let pageNode = null;
    let pagePos = 0;
    
    for (let depth = $from.depth; depth > 0; depth--) {
      const node = $from.node(depth);
      if (node.type.name === 'page') {
        pageNode = node;
        pagePos = $from.before(depth);
        break;
      }
    }
    
    // If page is empty, remove it (only if not the last page)
    if (pageNode && isPageEmpty(pageNode)) {
      const pageCount = countPages(doc);
      
      if (pageCount > 1) {
        // Find previous page to move cursor to
        let prevPagePos = null;
        let prevPage = null;
        const currentPageId = pageNode.attrs.id;
        
        // Walk through document to find previous page
        doc.forEach((node, offset) => {
          if (node.type.name === 'page') {
            if (node.attrs.id === currentPageId) {
              // Found current page, stop here
              return false;
            }
            prevPagePos = offset;
            prevPage = node;
          }
        });
        
        if (dispatch) {
          const tr = state.tr;
          
          // Delete the empty page by replacing it with empty fragment
          const deleteStart = pagePos;
          const deleteEnd = pagePos + pageNode.nodeSize;
          tr.replaceWith(deleteStart, deleteEnd, Fragment.empty);
          
          // If there's a previous page, move cursor to its end after deleting
          if (prevPage && prevPagePos !== null) {
            // After deletion, find the previous page in the new document by ID
            let newPrevPagePos = null;
            tr.doc.forEach((node, offset) => {
              if (node.type.name === 'page' && node.attrs.id === prevPage.attrs.id) {
                newPrevPagePos = offset;
                return false;
              }
            });
            
            if (newPrevPagePos !== null) {
              const prevPageNode = tr.doc.nodeAt(newPrevPagePos);
              if (prevPageNode) {
                const prevPageEnd = newPrevPagePos + prevPageNode.nodeSize - 1;
                tr.setSelection(TextSelection.create(tr.doc, prevPageEnd));
              }
            }
          }
          
          dispatch(tr);
        }
        
        return true;
      }
    }
    
    return false;
  };

  // Custom handler for delete on empty pages
  const deleteHandler = (state, dispatch) => {
    const { selection, doc } = state;
    const { $from } = selection;
    
    // Only handle empty page deletion when selection is empty (cursor only, no text selected)
    if (!selection.empty) {
      return false; // Let default delete handler work for text selection
    }
    
    // Find the page node we're in
    let pageNode = null;
    let pagePos = 0;
    
    for (let depth = $from.depth; depth > 0; depth--) {
      const node = $from.node(depth);
      if (node.type.name === 'page') {
        pageNode = node;
        pagePos = $from.before(depth);
        break;
      }
    }
    
    // If page is empty, remove it (only if not the last page)
    if (pageNode && isPageEmpty(pageNode)) {
      const pageCount = countPages(doc);
      
      if (pageCount > 1) {
        // Find next page to move cursor to
        let nextPagePos = null;
        let nextPage = null;
        const currentPageId = pageNode.attrs.id;
        let foundCurrent = false;
        
        doc.forEach((node, offset) => {
          if (node.type.name === 'page') {
            if (node.attrs.id === currentPageId) {
              foundCurrent = true;
              return;
            }
            if (foundCurrent && !nextPage) {
              nextPagePos = offset;
              nextPage = node;
              return false; // Stop after finding first next page
            }
          }
        });
        
        if (dispatch) {
          const tr = state.tr;
          
          // Delete the empty page by replacing it with empty fragment
          const deleteStart = pagePos;
          const deleteEnd = pagePos + pageNode.nodeSize;
          tr.replaceWith(deleteStart, deleteEnd, Fragment.empty);
          
          // If there's a next page, move cursor to its start after deleting
          if (nextPage && nextPagePos !== null) {
            // After deletion, find the next page in the new document by ID
            let newNextPagePos = null;
            tr.doc.forEach((node, offset) => {
              if (node.type.name === 'page' && node.attrs.id === nextPage.attrs.id) {
                newNextPagePos = offset;
                return false;
              }
            });
            
            if (newNextPagePos !== null) {
              const nextPageStart = newNextPagePos + 1;
              tr.setSelection(TextSelection.create(tr.doc, nextPageStart));
            }
          }
          
          dispatch(tr);
        }
        
        return true;
      }
    }
    
    return false;
  };
  
  formattingKeymap['Backspace'] = backspaceHandler;
  formattingKeymap['Delete'] = deleteHandler;
  
  const plugins = [
    history(),
    keymap(formattingKeymap),
    keymap(baseKeymap),
    clipboardPlugin(generateId),
  ];
  
  // Add pagination plugin if required functions are provided
  if (getPageContentHeight && generateId) {
    plugins.push(
      paginationPlugin({
        getPageContentHeight,
        generateId,
        schema: pagedEditorSchema,
        editorViewRef,
        onContentChange,
      })
    );
  }
  
  // Always ensure we have at least one page
  let finalDoc = null;
  
  if (content && content.trim()) {
    try {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = content;
      const parsed = parser.parse(tempDiv);
      
      // Check if the parsed document already has page nodes
      if (parsed.content.childCount > 0 && parsed.content.firstChild?.type.name === 'page') {
        // Document already has pages, use it as-is
        finalDoc = parsed;
      } else {
        // Wrap content in a page node
        const pageNodeInstance = pagedEditorSchema.nodes.page.create(
          { id: generateId ? generateId() : Date.now() },
          parsed.content.childCount > 0 ? parsed.content : [pagedEditorSchema.nodes.paragraph.create()]
        );
        finalDoc = pagedEditorSchema.nodes.doc.create({}, [pageNodeInstance]);
      }
    } catch (e) {
      console.warn('Failed to parse content', e);
      // Fall through to create empty page
    }
  }
  
  // If no document was created (empty content or parse error), create empty page
  if (!finalDoc) {
    const emptyPage = pagedEditorSchema.nodes.page.create(
      { id: generateId ? generateId() : Date.now() },
      [pagedEditorSchema.nodes.paragraph.create()]
    );
    finalDoc = pagedEditorSchema.nodes.doc.create({}, [emptyPage]);
  }
  
  // Ensure document has at least one page
  if (finalDoc.content.childCount === 0) {
    const emptyPage = pagedEditorSchema.nodes.page.create(
      { id: generateId ? generateId() : Date.now() },
      [pagedEditorSchema.nodes.paragraph.create()]
    );
    finalDoc = pagedEditorSchema.nodes.doc.create({}, [emptyPage]);
  }
  
  return EditorState.create({
    doc: finalDoc,
    schema: pagedEditorSchema,
    plugins,
  });
}
