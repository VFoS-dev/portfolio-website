export const pageNode = {
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

export const paragraphNode = {
  content: 'inline*',
  group: 'block',
  attrs: { textAlign: { default: 'left' } },
  parseDOM: [{
    tag: 'p',
    getAttrs(dom) {
      return { textAlign: dom.style.textAlign || 'left' };
    },
  }],
  toDOM(node) {
    return ['p', { style: `text-align: ${node.attrs.textAlign}` }, 0];
  },
};
