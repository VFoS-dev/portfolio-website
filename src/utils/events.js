export const SendKeyCode = (keyCode) => window.dispatchEvent(new CustomEvent('custom-keydown', { detail: { keyCode } }));