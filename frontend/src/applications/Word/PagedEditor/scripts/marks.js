export const underlineMark = {
  parseDOM: [{ tag: 'u' }, { style: 'text-decoration', getAttrs: value => value === 'underline' && null }],
  toDOM: () => ['u', 0],
};

export const fontFamilyMark = {
  attrs: {
    family: { default: null },
  },
  parseDOM: [
    {
      style: 'font-family',
      getAttrs: (value) => {
        return { family: value || null };
      },
    },
    {
      tag: 'span[style*="font-family"]',
      getAttrs: (node) => {
        const style = node.getAttribute('style') || '';
        const match = style.match(/font-family:\s*([^;]+)/);
        return { family: match ? match[1].trim() : null };
      },
    },
  ],
  toDOM: (mark) => {
    return mark.attrs.family
      ? ['span', { style: `font-family: ${mark.attrs.family}` }, 0]
      : ['span', 0];
  },
};

export const fontSizeMark = {
  attrs: {
    size: { default: null },
  },
  parseDOM: [
    {
      style: 'font-size',
      getAttrs: (value) => {
        return { size: value || null };
      },
    },
    {
      tag: 'span[style*="font-size"]',
      getAttrs: (node) => {
        const style = node.getAttribute('style') || '';
        const match = style.match(/font-size:\s*([^;]+)/);
        return { size: match ? match[1].trim() : null };
      },
    },
  ],
  toDOM: (mark) => {
    return mark.attrs.size
      ? ['span', { style: `font-size: ${mark.attrs.size}` }, 0]
      : ['span', 0];
  },
};

