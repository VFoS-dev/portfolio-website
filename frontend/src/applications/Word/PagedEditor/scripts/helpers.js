import { DOMSerializer } from 'prosemirror-model';
import { pagedEditorSchema } from './service.js';
import { wrapInList, liftListItem } from 'prosemirror-schema-list';
import { TextSelection } from 'prosemirror-state';

/**
 * Serializes the editor content to HTML
 * @param {EditorView} editorView - The ProseMirror editor view
 * @returns {string} HTML content string
 */
export function serializeContent(editorView) {
  if (!editorView) return '';
  
  const serializer = DOMSerializer.fromSchema(pagedEditorSchema);
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

/**
 * Parses margin string to pixels
 * @param {string} margin - Margin string (e.g., "1in", "40px", "12pt")
 * @returns {number} Margin in pixels
 */
export function parseMargin(margin) {
  if (margin.endsWith('in')) {
    return parseFloat(margin) * 96;
  } else if (margin.endsWith('px')) {
    return parseFloat(margin);
  } else if (margin.endsWith('pt')) {
    return parseFloat(margin) * 1.33;
  }
  return 96;
}

/**
 * Gets the page content height based on margins
 * @param {string} topMargin - Top margin string
 * @param {string} bottomMargin - Bottom margin string
 * @returns {number} Content height in pixels
 */
export function getPageContentHeight(topMargin, bottomMargin) {
  const topMarginPx = parseMargin(topMargin);
  const bottomMarginPx = parseMargin(bottomMargin);
  const PAGE_HEIGHT = 11 * 96; // 11 inches
  return PAGE_HEIGHT - topMarginPx - bottomMarginPx;
}

/**
 * Generates a unique ID
 * @returns {string} Unique ID string
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

/**
 * Resolves a string or NodeType to a NodeType from the schema.
 * @param {NodeType | string} node
 * @param {EditorState} state
 * @returns {NodeType}
 */
function stringToNode(node, state) {
  if (typeof node === 'string') {
    return state.schema.nodes[node];
  }
  return node;
}

/**
 * Finds a parent node of the given type in the selection.
 * @param {NodeType} nodeType - The node type to find
 * @param {Selection} selection - The current selection
 * @returns {{ pos: number, node: Node } | null}
 */
function findParentNodeOfType(nodeType) {
  return (selection) => {
    const { $from } = selection;
    for (let depth = $from.depth; depth > 0; depth--) {
      const node = $from.node(depth);
      if (node.type === nodeType) {
        return {
          pos: $from.before(depth),
          node,
        };
      }
    }
    return null;
  };
}

/**
 * Checks if the current block is wrapped in a node of the given type.
 * @param {NodeType | string} node
 * @param {EditorState} state
 * @returns {boolean}
 */
export function isWrappedIn(node) {
  return (state) => {
    const { $from } = state.selection;
    const nodeType = stringToNode(node, state);
    return $from.node(-1).type === nodeType;
  };
}

/**
 * Gets the list node type from the current selection.
 * @param {EditorState} state
 * @returns {NodeType | null}
 */
export function getListTypeFromSelection(state) {
  const { $from } = state.selection;
  const { list_item } = state.schema.nodes;

  if ($from.node(-1)?.type === list_item) {
    const parentListNode = $from.node(-2);
    if (parentListNode) {
      return parentListNode.type;
    }
  }
  return null;
}

/**
 * Converts an existing list type to another.
 * @param {{ oldList: NodeType, newList: NodeType }} options
 * @returns {(state: EditorState, dispatch: Dispatch) => boolean}
 */
export function changeListToList({ oldList, newList }) {
  return (state, dispatch) => {
    const { tr, selection } = state;
    const parentList = findParentNodeOfType(oldList)(selection);

    if (parentList) {
      const { pos, node } = parentList;
      tr.setNodeMarkup(pos, newList, node.attrs);

      dispatch?.(tr);

      return true;
    }

    return false;
  };
}

/**
 * Converts between list types or lifts out of a list.
 * @param {string} listName - Name of the list node type.
 * @returns {(state: EditorState, dispatch: Dispatch, view: EditorView) => boolean}
 */
export function listToList(listName) {
  return (state, dispatch, view) => {
    const { [listName]: newList, list_item } = state.schema.nodes;
    if (!isWrappedIn('list_item')(state)) {
      return wrapInList(newList)(state, dispatch, view);
    }

    const oldList = getListTypeFromSelection(state);
    if (oldList?.name === listName) {
      return liftListItem(list_item)(state, dispatch, view);
    }

    return changeListToList({
      oldList,
      newList,
    })(state, dispatch, view);
  };
}

/**
 * Gets the type of the node at the current selection.
 * @param {EditorState} state
 * @returns {NodeType}
 */
export function getCurrentNodeType(state) {
  const { $from } = state.selection;
  return $from.parent.type;
}

/**
 * Inserts a paragraph after the current node if the cursor is at the end.
 * @param {EditorState} state
 * @param {Dispatch} dispatch
 * @returns {boolean}
 */
export function exitNodeToParagraph(state, dispatch) {
  const { $from, empty } = state.selection;
  // if not at the end add a new line instead
  if (!empty || $from.parentOffset !== $from.parent.content.size) {
    return false; // Do nothing if not at the end of the node
  }

  const afterCurrentNode = $from.end();
  const paragraph = state.schema.nodes.paragraph.create();

  const tr = state.tr.insert(afterCurrentNode, paragraph);
  tr.setSelection(TextSelection.near(tr.doc.resolve(afterCurrentNode + 1)));

  dispatch?.(tr);

  return true;
}
