/**
 * Gets the type of the node at the current selection.
 * @param {EditorState} state
 * @returns {NodeType}
 */
function getCurrentNodeType(state) {
  const { $from } = state.selection;
  return $from.parent.type;
}

/**
 * Modifies the parent node's attributes.
 * @param {Object} attr - Attributes to apply.
 * @returns {(state: EditorState, dispatch: Dispatch) => void}
 */
export function modifyParentNode(attr) {
  return (state, dispatch) => {
    const { tr, selection } = state;
    const { $from } = selection;

    dispatch(tr.setNodeMarkup($from.before(), getCurrentNodeType(state), attr));
  };
}

/**
 * Checks if the parent node of the current selection has a specific attribute (and optional value).
 * @param {string} attrKey - The name of the attribute to check.
 * @param {*} [attrValue] - Optional value that the attribute should match.
 * @returns {(state: EditorState) => boolean} A predicate function that returns true if the parent node has the attribute.
 */
export function parentHasAttr(attrKey, attrValue = undefined) {
  return (state) => {
    const { $from } = state.selection;
    const parentDepth = $from.depth;

    if (parentDepth === 0) return false; // at top-level, no parent

    const parent = $from.node(parentDepth);

    if (!parent || !parent.attrs) return false;

    if (attrValue === undefined) {
      return attrKey in parent.attrs;
    }

    return parent.attrs[attrKey] === attrValue;
  };
}

/**
 * Sets text alignment for the current selection or block
 * @param {string} alignment - Alignment value ('left', 'center', 'right', 'justify')
 * @returns {(state: EditorState, dispatch: Dispatch) => boolean}
 */
export function setTextAlign(alignment) {
  return modifyParentNode({ textAlign: alignment || 'left' });
}

/**
 * Gets the current text alignment
 * @param {EditorState} state - The editor state
 * @returns {string} Alignment value ('left', 'center', 'right', 'justify')
 */
export function getTextAlign(state) {
  if (!state) return 'left';
  
  const { $from } = state.selection;
  const parentDepth = $from.depth;
  
  if (parentDepth === 0) return 'left';
  
  const parent = $from.node(parentDepth);
  
  if (!parent || !parent.attrs) return 'left';
  
  return parent.attrs.textAlign || 'left';
}
