/**
 * Composable for platform-specific font detection and lists
 */
export function useFonts() {
  function detectPlatform() {
    const userAgent = navigator.userAgent || navigator.platform || '';
    const platform = userAgent.toLowerCase();
    
    if (/iphone|ipad|ipod/.test(platform)) {
      return 'ios';
    } else if (/android/.test(platform)) {
      return 'android';
    } else if (/mac/.test(platform) || /darwin/.test(platform)) {
      return 'macos';
    } else if (/win/.test(platform)) {
      return 'windows';
    } else if (/linux/.test(platform)) {
      return 'linux';
    }
    return 'unknown';
  }

  const platform = detectPlatform();

  const platformFonts = {
    ios: [
      { group: 'Serif', fonts: ['Times New Roman', 'Georgia', 'Palatino', 'Baskerville', 'Hoefler Text', 'Didot'] },
      { group: 'Sans-Serif', fonts: ['Arial', 'Helvetica', 'Helvetica Neue', 'Verdana', 'Trebuchet MS', 'Lucida Grande', 'Geneva', 'Optima', 'Futura', 'Gill Sans'] },
      { group: 'Monospace', fonts: ['Courier New', 'Courier', 'Monaco', 'Menlo'] },
      { group: 'Display', fonts: ['Impact', 'Comic Sans MS', 'Marker Felt', 'Chalkduster', 'Papyrus'] },
      { group: 'Script', fonts: ['Brush Script', 'Lucida Handwriting', 'Apple Chancery', 'Snell Roundhand', 'Zapfino'] },
    ],
    macos: [
      { group: 'Serif', fonts: ['Times New Roman', 'Georgia', 'Palatino', 'Baskerville', 'Hoefler Text', 'Didot', 'Goudy Old Style'] },
      { group: 'Sans-Serif', fonts: ['Arial', 'Helvetica', 'Helvetica Neue', 'Verdana', 'Trebuchet MS', 'Lucida Grande', 'Geneva', 'Optima', 'Futura', 'Gill Sans'] },
      { group: 'Monospace', fonts: ['Courier New', 'Courier', 'Monaco', 'Menlo'] },
      { group: 'Display', fonts: ['Impact', 'Comic Sans MS', 'Marker Felt', 'Chalkduster', 'Papyrus'] },
      { group: 'Script', fonts: ['Brush Script', 'Lucida Handwriting', 'Apple Chancery', 'Snell Roundhand', 'Zapfino'] },
    ],
    windows: [
      { group: 'Serif', fonts: ['Times New Roman', 'Georgia', 'Palatino Linotype', 'Book Antiqua', 'Garamond', 'Baskerville Old Face', 'Bodoni MT', 'Century Schoolbook', 'Goudy Old Style'] },
      { group: 'Sans-Serif', fonts: ['Arial', 'Helvetica', 'Verdana', 'Tahoma', 'Trebuchet MS', 'Lucida Sans Unicode', 'Segoe UI', 'Calibri', 'Candara', 'Corbel', 'Franklin Gothic Medium'] },
      { group: 'Monospace', fonts: ['Courier New', 'Courier', 'Consolas', 'Lucida Console'] },
      { group: 'Display', fonts: ['Impact', 'Comic Sans MS', 'Arial Black', 'Copperplate', 'Copperplate Gothic Light', 'Copperplate Gothic Bold', 'Papyrus'] },
      { group: 'Script', fonts: ['Brush Script MT', 'Lucida Handwriting', 'Script MT Bold'] },
    ],
    android: [
      { group: 'Serif', fonts: ['Times New Roman', 'Georgia', 'Droid Serif', 'Noto Serif'] },
      { group: 'Sans-Serif', fonts: ['Arial', 'Helvetica', 'Verdana', 'Roboto', 'Droid Sans', 'Noto Sans'] },
      { group: 'Monospace', fonts: ['Courier New', 'Courier', 'Droid Sans Mono', 'Noto Sans Mono'] },
      { group: 'Display', fonts: ['Impact', 'Comic Sans MS'] },
    ],
    linux: [
      { group: 'Serif', fonts: ['Times New Roman', 'Georgia', 'Liberation Serif', 'DejaVu Serif'] },
      { group: 'Sans-Serif', fonts: ['Arial', 'Helvetica', 'Verdana', 'Liberation Sans', 'DejaVu Sans'] },
      { group: 'Monospace', fonts: ['Courier New', 'Courier', 'Liberation Mono', 'DejaVu Sans Mono'] },
      { group: 'Display', fonts: ['Impact', 'Comic Sans MS'] },
    ],
    unknown: [
      { group: 'Serif', fonts: ['Times New Roman', 'Georgia', 'Palatino'] },
      { group: 'Sans-Serif', fonts: ['Arial', 'Helvetica', 'Verdana', 'Trebuchet MS'] },
      { group: 'Monospace', fonts: ['Courier New', 'Courier'] },
      { group: 'Display', fonts: ['Impact', 'Comic Sans MS'] },
    ],
  };

  const availableFonts = platformFonts[platform] || platformFonts.unknown;
  const fontSizes = [8, 9, 10, 11, 12, 14, 16, 18, 20, 24, 28, 32, 36, 48, 72];

  return {
    availableFonts,
    fontSizes,
    platform,
  };
}
