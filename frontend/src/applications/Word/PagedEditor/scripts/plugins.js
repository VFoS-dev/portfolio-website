import { Plugin } from 'prosemirror-state';
import { Fragment, Slice } from 'prosemirror-model';

/**
 * Creates a plugin that handles clipboard operations for page nodes and enforces document structure
 * @param {Function} generateId - Function to generate page IDs
 * @returns {Plugin}
 */
export function clipboardPlugin(generateId) {
  return new Plugin({
    props: {
      handlePaste(view, event, slice) {
        const { selection } = view.state;
        const { $from } = selection;
        
        // Check if we're inside a page node
        let insidePage = false;
        for (let i = $from.depth; i > 0; i--) {
          if ($from.node(i).type.name === 'page') {
            insidePage = true;
            break;
          }
        }
        
        if (!insidePage) {
          return false; // Let default paste handler work
        }
        
        // Check if the slice contains any page nodes
        let hasPageNodes = false;
        const content = slice.content;
        
        content.forEach((node) => {
          if (node.type.name === 'page') {
            hasPageNodes = true;
          } else {
            // Recursively check nested content
            node.descendants((n) => {
              if (n.type.name === 'page') {
                hasPageNodes = true;
                return false; // Stop traversal
              }
            });
          }
        });
        
        if (!hasPageNodes) {
          return false; // No page nodes, let default handler work
        }
        
        // Extract content from page nodes
        const extractedNodes = [];
        
        function extractFromNode(node) {
          if (node.type.name === 'page') {
            // Extract all block content from the page
            for (let i = 0; i < node.content.childCount; i++) {
              const child = node.content.child(i);
              // Recursively extract from nested pages (defensive)
              if (child.type.name === 'page') {
                extractFromNode(child);
              } else {
                extractedNodes.push(child);
              }
            }
          } else {
            // Check if this node contains page nodes
            const hasNestedPages = node.content && node.content.childCount > 0;
            if (hasNestedPages) {
              for (let i = 0; i < node.content.childCount; i++) {
                extractFromNode(node.content.child(i));
              }
            } else {
              extractedNodes.push(node);
            }
          }
        }
        
        content.forEach((node) => {
          extractFromNode(node);
        });
        
        // If we extracted content, create a new slice with just the content
        if (extractedNodes.length > 0) {
          const fragment = Fragment.from(extractedNodes);
          const newSlice = new Slice(fragment, slice.openStart, slice.openEnd);
          
          // Use the default paste command with our modified slice
          const { state, dispatch } = view;
          const tr = state.tr;
          tr.replaceSelection(newSlice);
          
          if (dispatch) {
            dispatch(tr);
          }
          
          return true; // Handled
        }
        
        return false;
      },
    },
    appendTransaction(transactions, oldState, newState) {
      const tr = newState.tr;
      let hasChanges = false;
      
      // Check for pages nested inside pages and remove them
      const nestedPages = [];
      
      newState.doc.descendants((node, pos) => {
        if (node.type.name === 'page') {
          // Check if this page contains any page nodes
          node.descendants((childNode, childPos) => {
            if (childNode.type.name === 'page' && childNode !== node) {
              // Found a page inside a page - collect it for removal
              const absolutePos = pos + childPos + 1;
              nestedPages.push({
                start: absolutePos,
                end: absolutePos + childNode.nodeSize - 2,
                content: childNode.content,
              });
              return false; // Stop traversal of this branch
            }
          });
        }
      });
      
      if (nestedPages.length > 0) {
        hasChanges = true;
        // Apply changes in reverse order to maintain correct positions
        nestedPages.sort((a, b) => b.start - a.start); // Sort descending by position
        
        nestedPages.forEach(({ start, end, content }) => {
          tr.replaceWith(start, end, content);
        });
      }
      
      // Check for non-page nodes at document root and wrap them in pages
      const doc = tr.doc;
      const nonPageNodes = [];
      let currentPos = 1;
      
      // Collect all non-page nodes at root level
      for (let i = 0; i < doc.content.childCount; i++) {
        const child = doc.content.child(i);
        if (child.type.name !== 'page') {
          nonPageNodes.push({
            node: child,
            start: currentPos,
            end: currentPos + child.nodeSize,
          });
        }
        currentPos += child.nodeSize;
      }
      
      // Wrap non-page nodes in a page (group consecutive ones together)
      if (nonPageNodes.length > 0) {
        hasChanges = true;
        // Group consecutive non-page nodes
        let groupStart = nonPageNodes[0].start;
        let groupEnd = nonPageNodes[0].end;
        const nodesToWrap = [nonPageNodes[0].node];
        
        for (let i = 1; i < nonPageNodes.length; i++) {
          const current = nonPageNodes[i];
          // If this node is right after the previous group, add to group
          if (current.start === groupEnd) {
            nodesToWrap.push(current.node);
            groupEnd = current.end;
          } else {
            // Wrap the previous group
            const pageId = generateId ? generateId() : Date.now().toString(36) + Math.random().toString(36).substr(2);
            const newPage = doc.type.schema.nodes.page.create(
              { id: pageId },
              nodesToWrap.length > 0 ? nodesToWrap : [doc.type.schema.nodes.paragraph.create()]
            );
            tr.replaceWith(groupStart, groupEnd, newPage);
            
            // Start new group
            groupStart = current.start;
            groupEnd = current.end;
            nodesToWrap.length = 0;
            nodesToWrap.push(current.node);
          }
        }
        
        // Wrap the last group
        if (nodesToWrap.length > 0) {
          const pageId = generateId ? generateId() : Date.now().toString(36) + Math.random().toString(36).substr(2);
          const newPage = doc.type.schema.nodes.page.create(
            { id: pageId },
            nodesToWrap.length > 0 ? nodesToWrap : [doc.type.schema.nodes.paragraph.create()]
          );
          tr.replaceWith(groupStart, groupEnd, newPage);
        }
      }
      
      // Ensure there's always at least one page
      if (tr.doc.content.childCount === 0) {
        hasChanges = true;
        const pageId = generateId ? generateId() : Date.now().toString(36) + Math.random().toString(36).substr(2);
        const emptyPage = tr.doc.type.schema.nodes.page.create(
          { id: pageId },
          [tr.doc.type.schema.nodes.paragraph.create()]
        );
        tr.insert(1, emptyPage);
      }
      
      // Convert any headings to paragraphs (to prevent Enter from creating headings)
      const headingsToConvert = [];
      tr.doc.descendants((node, pos) => {
        if (node.type.name === 'heading') {
          headingsToConvert.push({ node, pos });
        }
      });
      
      if (headingsToConvert.length > 0) {
        hasChanges = true;
        // Convert headings to paragraphs
        headingsToConvert.forEach(({ node, pos }) => {
          const paragraph = tr.doc.type.schema.nodes.paragraph.create({}, node.content);
          tr.replaceWith(pos, pos + node.nodeSize, paragraph);
        });
      }
      
      return hasChanges ? tr : null;
    },
  });
}

/**
 * Creates a plugin that handles pagination (splitting and merging pages)
 * @param {Object} options - Configuration options
 * @param {Function} options.getPageContentHeight - Function to get max page content height
 * @param {Function} options.generateId - Function to generate page IDs
 * @param {Schema} options.schema - The ProseMirror schema
 * @param {EditorView} options.editorViewRef - Reference to editor view
 * @param {Function} options.onContentChange - Callback when content changes
 * @returns {Plugin}
 */
export function paginationPlugin({ getPageContentHeight, generateId, schema, editorViewRef, onContentChange }) {
  let checkTimeout = null;
  let editorView = null;
  
  // Helper functions (these would ideally be in a separate utils file)
  function canMergePages(firstPage, secondPage, maxHeight) {
    if (!firstPage || !secondPage) return false;
    
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
    const mergedPage = schema.nodes.page.create(
      { id: firstPage.attrs.id },
      combinedNodes.length > 0 ? combinedNodes : [schema.nodes.paragraph.create()]
    );
    
    // Calculate positions
    const firstPageStartPos = firstPageOffset;
    const secondPageStartPos = firstPageOffset + firstPage.nodeSize;
    const secondPageEndPos = secondPageStartPos + secondPage.nodeSize;
    
    // Replace both pages with the merged page
    tr.replaceWith(firstPageStartPos, secondPageEndPos, mergedPage);
    
    return tr;
  }
  
  function findSplitPoint(pageNode, maxHeight, pageElement) {
    const pageContent = pageNode.content;
    if (pageContent.childCount === 0) {
      return null;
    }
    
    const childElements = Array.from(pageElement.children);
    if (childElements.length === 0) {
      return null;
    }
    
    let accumulatedHeight = 0;
    let splitIndex = -1;
    
    for (let i = 0; i < pageContent.childCount && i < childElements.length; i++) {
      const element = childElements[i];
      const computedStyle = window.getComputedStyle(element);
      
      const height = element.offsetHeight;
      const marginTop = parseFloat(computedStyle.marginTop) || 0;
      const marginBottom = parseFloat(computedStyle.marginBottom) || 0;
      const nodeHeight = height + marginTop + marginBottom;
      
      if (accumulatedHeight + nodeHeight > maxHeight) {
        if (i > 0) {
          splitIndex = i;
          break;
        } else {
          splitIndex = 1;
          break;
        }
      }
      
      accumulatedHeight += nodeHeight;
    }
    
    if (splitIndex === -1 && pageContent.childCount > 1) {
      splitIndex = Math.max(1, Math.floor(pageContent.childCount / 2));
    }
    
    if (splitIndex === -1 || splitIndex === 0) {
      return null;
    }
    
    let pos = 1;
    for (let j = 0; j < splitIndex; j++) {
      pos += pageContent.child(j).nodeSize;
    }
    
    return { pos, index: splitIndex };
  }
  
  function splitPageAt(tr, pageNode, splitInfo, pageOffset) {
    const pageContent = pageNode.content;
    
    const firstHalfNodes = [];
    const secondHalfNodes = [];
    
    for (let i = 0; i < pageContent.childCount; i++) {
      if (i < splitInfo.index) {
        firstHalfNodes.push(pageContent.child(i));
      } else {
        secondHalfNodes.push(pageContent.child(i));
      }
    }
    
    if (secondHalfNodes.length === 0) {
      return null;
    }
    
    const newPageId = generateId();
    
    const updatedPage = schema.nodes.page.create(
      { id: pageNode.attrs.id },
      firstHalfNodes.length > 0 ? firstHalfNodes : [schema.nodes.paragraph.create()]
    );
    
    const newPage = schema.nodes.page.create(
      { id: newPageId },
      secondHalfNodes
    );
    
    const pageStartPos = pageOffset;
    const pageEndPos = pageOffset + pageNode.nodeSize;
    
    const doc = tr.doc;
    let nextPage = null;
    let nextPageOffset = 0;
    
    let foundCurrent = false;
    doc.forEach((node, offset) => {
      if (node === pageNode) {
        foundCurrent = true;
        return;
      }
      if (foundCurrent && node.type.name === 'page' && !nextPage) {
        nextPage = node;
        nextPageOffset = offset;
        return false;
      }
    });
    
    const maxHeight = getPageContentHeight();
    if (nextPage && canMergePages(newPage, nextPage, maxHeight)) {
      const mergedNodes = [...secondHalfNodes];
      for (let i = 0; i < nextPage.content.childCount; i++) {
        mergedNodes.push(nextPage.content.child(i));
      }
      
      const mergedNextPage = schema.nodes.page.create(
        { id: nextPage.attrs.id },
        mergedNodes
      );
      
      const nextPageEndPos = nextPageOffset + nextPage.nodeSize;
      const fragment = Fragment.from([updatedPage, mergedNextPage]);
      tr.replaceWith(pageStartPos, nextPageEndPos, fragment);
    } else {
      const fragment = Fragment.from([updatedPage, newPage]);
      tr.replaceWith(pageStartPos, pageEndPos, fragment);
    }
    
    return tr;
  }
  
  function checkAndSplitPages(state, maxIterations = 10) {
    if (!editorView) return;
    if (maxIterations <= 0) return; // Prevent infinite loops
    
    const doc = state.doc;
    const maxHeight = getPageContentHeight();
    let hasChanges = false;
    
    // First check for pages that can be merged
    let prevPage = null;
    let prevPageOffset = 0;
    
    doc.forEach((node, offset) => {
      if (node.type.name === 'page' && prevPage) {
        if (canMergePages(prevPage, node, maxHeight)) {
          const tr = state.tr;
          const mergeResult = mergePages(tr, prevPage, node, prevPageOffset);
          if (mergeResult) {
            editorView.dispatch(mergeResult);
            if (onContentChange) {
              onContentChange();
            }
            hasChanges = true;
            return false;
          }
        }
      }
      if (node.type.name === 'page') {
        prevPage = node;
        prevPageOffset = offset;
      }
    });
    
    // If we merged pages, check again with updated state
    if (hasChanges) {
      setTimeout(() => {
        if (editorView) {
          checkAndSplitPages(editorView.state, maxIterations - 1);
        }
      }, 50);
      return;
    }
    
    // Then check for overflowing pages
    let overflowPage = null;
    let pageOffset = 0;
    let pageElement = null;
    
    doc.forEach((node, offset) => {
      if (node.type.name === 'page' && !overflowPage) {
        const element = editorView.dom.querySelector(`[data-page-id="${node.attrs.id}"]`);
        
        if (element) {
          const computedStyle = window.getComputedStyle(element);
          const paddingTop = parseFloat(computedStyle.paddingTop) || 0;
          const paddingBottom = parseFloat(computedStyle.paddingBottom) || 0;
          const scrollHeight = element.scrollHeight;
          const actualContentHeight = scrollHeight - paddingTop - paddingBottom;
          
          if (actualContentHeight > maxHeight) {
            overflowPage = node;
            pageOffset = offset;
            pageElement = element;
            return false;
          }
        }
      }
    });
    
    if (!overflowPage || !pageElement) {
      return;
    }
    
    const splitInfo = findSplitPoint(overflowPage, maxHeight, pageElement);
    if (!splitInfo) {
      return;
    }
    
    const tr = state.tr;
    const result = splitPageAt(tr, overflowPage, splitInfo, pageOffset);
    if (result) {
      editorView.dispatch(result);
      if (onContentChange) {
        onContentChange();
      }
      
      // After splitting, check again to see if more splitting is needed
      setTimeout(() => {
        if (editorView) {
          checkAndSplitPages(editorView.state, maxIterations - 1);
        }
      }, 50);
    }
  }
  
  return new Plugin({
    appendTransaction(transactions, oldState, newState) {
      if (!transactions.some(tr => tr.docChanged)) {
        return null;
      }
      
      if (!editorView) {
        return null;
      }
      
      if (checkTimeout) {
        clearTimeout(checkTimeout);
      }
      
      checkTimeout = setTimeout(() => {
        checkTimeout = null;
        checkAndSplitPages(newState);
      }, 0);
      
      return null;
    },
    
    view(view) {
      editorView = view;
      if (editorViewRef) {
        editorViewRef.current = view;
      }
      
      // Check for overflow on initial render
      setTimeout(() => {
        if (editorView) {
          checkAndSplitPages(editorView.state);
        }
      }, 100);
      
      return {
        update() {
          // Also check after view updates (e.g., after DOM rendering)
          if (checkTimeout) {
            clearTimeout(checkTimeout);
          }
          
          checkTimeout = setTimeout(() => {
            checkTimeout = null;
            if (editorView) {
              checkAndSplitPages(editorView.state);
            }
          }, 50);
        },
        destroy() {
          if (checkTimeout) {
            clearTimeout(checkTimeout);
          }
        }
      };
    }
  });
}
