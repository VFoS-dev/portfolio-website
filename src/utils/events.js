export const SendKeyCode = (keyCode) => window.dispatchEvent(new KeyboardEvent('keydown', { keyCode }));