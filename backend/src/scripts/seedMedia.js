require('dotenv').config({ path: __dirname + '/../../.env' });
const { env } = require('../_helper/env');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');

// Import Media model
const Media = require('../_models/Media');

// Connect to database
const mongoUrl = env("MongoDB_URL", 'mongodb://127.0.0.1:27017/Portfolio');
mongoose.connect(mongoUrl).then(async () => {
  console.log("Connected to Database");
  
  // Get frontend URL from environment, defaulting to localhost:3000
  const FRONTEND_URL = env('FRONTEND_URL', 'http://localhost:3000').replace(/\/$/, ''); // Remove trailing slash
  
  // Path to frontend public folder
  const publicPath = path.join(__dirname, '../../../frontend/public');
  
  if (!fs.existsSync(publicPath)) {
    console.error(`Error: Public folder not found at ${publicPath}`);
    process.exit(1);
  }
  
  // Supported image and video extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp', '.ico'];
  const videoExtensions = ['.mp4', '.webm', '.ogg', '.mov', '.avi', '.wmv', '.flv', '.mkv'];
  
  // Function to check if file is a media file
  function isMediaFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return imageExtensions.includes(ext) || videoExtensions.includes(ext);
  }
  
  // Function to determine file type
  function getFileType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    if (imageExtensions.includes(ext)) {
      return 'image';
    } else if (videoExtensions.includes(ext)) {
      return 'video';
    }
    return 'other';
  }
  
  // Function to get MIME type
  function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.gif': 'image/gif',
      '.webp': 'image/webp',
      '.svg': 'image/svg+xml',
      '.bmp': 'image/bmp',
      '.ico': 'image/x-icon',
      '.mp4': 'video/mp4',
      '.webm': 'video/webm',
      '.ogg': 'video/ogg',
      '.mov': 'video/quicktime',
      '.avi': 'video/x-msvideo',
      '.wmv': 'video/x-ms-wmv',
      '.flv': 'video/x-flv',
      '.mkv': 'video/x-matroska',
    };
    return mimeTypes[ext] || 'application/octet-stream';
  }
  
  // Recursively scan directory for media files
  function scanDirectory(dir, basePath = '') {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.join(basePath, entry.name).replace(/\\/g, '/'); // Normalize to forward slashes
      
      if (entry.isDirectory()) {
        // Recursively scan subdirectories
        files.push(...scanDirectory(fullPath, relativePath));
      } else if (entry.isFile() && isMediaFile(fullPath)) {
        files.push({
          fullPath,
          relativePath: '/' + relativePath, // Add leading slash for URL
          name: entry.name,
        });
      }
    }
    
    return files;
  }
  
  try {
    console.log(`Scanning public folder: ${publicPath}`);
    const mediaFiles = scanDirectory(publicPath);
    console.log(`Found ${mediaFiles.length} media files`);
    
    if (mediaFiles.length === 0) {
      console.log('No media files found in public folder');
      process.exit(0);
    }
    
    // Clear existing media entries (optional - comment out if you want to keep existing)
    // await Media.deleteMany({});
    // console.log('✓ Cleared existing media entries');
    
    // Process each file
    let created = 0;
    let skipped = 0;
    let errors = 0;
    
    for (const file of mediaFiles) {
      try {
        // Check if media already exists with this path
        const existing = await Media.findOne({ path: file.relativePath });
        if (existing) {
          console.log(`⏭️  Skipping (already exists): ${file.relativePath}`);
          skipped++;
          continue;
        }
        
        // Get file stats
        const stats = fs.statSync(file.fullPath);
        
        // Create full URL by prefixing relative path with frontend URL
        const fullUrl = `${FRONTEND_URL}${file.relativePath}`;
        
        // Create media entry
        const media = new Media({
          filename: path.basename(file.relativePath),
          originalName: file.name,
          url: fullUrl, // Full URL with frontend URL prefix
          type: getFileType(file.fullPath),
          mimeType: getMimeType(file.fullPath),
          size: stats.size,
          path: file.relativePath, // Store original relative path
        });
        
        await media.save();
        console.log(`✓ Created: ${file.relativePath}`);
        created++;
      } catch (error) {
        console.error(`✗ Error processing ${file.relativePath}:`, error.message);
        errors++;
      }
    }
    
    console.log('\n✅ Media seeding completed!');
    console.log(`   Created: ${created}`);
    console.log(`   Skipped: ${skipped}`);
    console.log(`   Errors: ${errors}`);
    process.exit(0);
  } catch (error) {
    console.error('Error seeding media:', error);
    process.exit(1);
  }
}).catch((err) => {
  console.log("Not Connected to Database ERROR! ", err);
  process.exit(1);
});

