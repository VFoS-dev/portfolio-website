const fs = require('fs');
const path = require('path');

// Read the Vue file to extract SVG data URLs
const vueFile = fs.readFileSync('src/views/ResumeView.vue', 'utf8');

// Extract minimize SVG
const minimizeMatch = vueFile.match(/button\.minimize\s*\{[^}]*background-image:\s*url\(data:image\/svg\+xml;charset=utf-8,([^)]+)\)/);
// Extract maximize SVG  
const maximizeMatch = vueFile.match(/button\.maximize\s*\{[^}]*background-image:\s*url\(data:image\/svg\+xml;charset=utf-8,([^)]+)\)/);
// Extract close SVG
const closeMatch = vueFile.match(/button\.close\s*\{[^}]*background-image:\s*url\(data:image\/svg\+xml;charset=utf-8,([^)]+)\)/);

if (minimizeMatch) {
  const decoded = decodeURIComponent(minimizeMatch[1]);
  fs.writeFileSync('public/images/resume/minimize.svg', decoded);
  console.log('Created minimize.svg');
}

if (maximizeMatch) {
  const decoded = decodeURIComponent(maximizeMatch[1]);
  fs.writeFileSync('public/images/resume/maximize.svg', decoded);
  console.log('Created maximize.svg');
}

if (closeMatch) {
  const decoded = decodeURIComponent(closeMatch[1]);
  fs.writeFileSync('public/images/resume/close.svg', decoded);
  console.log('Created close.svg');
}

