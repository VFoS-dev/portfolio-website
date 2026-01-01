const { Media } = require('../_helper/db');
const { uploadToS3, deleteFromS3, extractKeyFromUrl } = require('../_helper/s3');
const { env } = require('../_helper/env');
const path = require('path');

// Get frontend URL from environment, defaulting to localhost:3000
const FRONTEND_URL = env('FRONTEND_URL', 'http://localhost:3000').replace(/\/$/, ''); // Remove trailing slash

/**
 * Format media URL - if it's a relative path, prefix with frontend URL
 * If it's already a full URL (S3), return as-is
 */
function formatMediaUrl(url) {
  if (!url) return url;
  // If it's already a full URL (starts with http:// or https://), return as-is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  // If it's a relative path (starts with /), prefix with frontend URL
  if (url.startsWith('/')) {
    return `${FRONTEND_URL}${url}`;
  }
  // Otherwise, assume it's a relative path and add leading slash
  return `${FRONTEND_URL}/${url}`;
}

async function getMedia({ beta }) {
  const query = beta === '1' || beta === 1 ? {} : {};
  const media = await Media.find(query).sort({ createdAt: -1 });
  if (!media || media.length === 0) {
    return { status: 404, message: 'Media not found' };
  }
  // Format URLs before returning
  return { 
    status: 200, 
    data: media.map(item => {
      const json = item.toJSON();
      json.url = formatMediaUrl(json.url);
      return json;
    })
  };
}

async function createMedia({ files, file }) {
  try {
    // Multer with upload.single() puts file in req.file, but direct() might pass it differently
    let uploadFile = file;
    if (!uploadFile && files) {
      uploadFile = Array.isArray(files.file) ? files.file[0] : files.file;
    }
    
    if (!uploadFile) {
      return { status: 400, message: 'No file provided' };
    }

    const fileBuffer = uploadFile.buffer;
    const originalName = uploadFile.originalname;
    const mimeType = uploadFile.mimetype;

    // Determine file type
    let fileType = 'other';
    if (mimeType.startsWith('image/')) {
      fileType = 'image';
    } else if (mimeType.startsWith('video/')) {
      fileType = 'video';
    }

    // Upload to S3
    const { url, key } = await uploadToS3(fileBuffer, originalName, mimeType);

    // Save to database
    const media = new Media({
      filename: key,
      originalName,
      url,
      type: fileType,
      mimeType,
      size: fileBuffer.length,
    });

    await media.save();
    const json = media.toJSON();
    json.url = formatMediaUrl(json.url);
    return { status: 201, data: json };
  } catch (error) {
    console.error('Error creating media:', error);
    return { status: 400, message: error.message };
  }
}

async function updateMedia({ id, ...data }) {
  try {
    const media = await Media.findById(id);
    if (!media) {
      return { status: 404, message: 'Media not found' };
    }

    Object.assign(media, data);
    await media.save();
    const json = media.toJSON();
    json.url = formatMediaUrl(json.url);
    return { status: 200, data: json };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

async function deleteMedia({ id }) {
  try {
    const media = await Media.findById(id);
    if (!media) {
      return { status: 404, message: 'Media not found' };
    }

    // Delete from S3
    const key = extractKeyFromUrl(media.url) || media.filename;
    if (key) {
      try {
        await deleteFromS3(key);
      } catch (s3Error) {
        console.error('Error deleting from S3:', s3Error);
        // Continue with database deletion even if S3 deletion fails
      }
    }

    // Delete from database
    await Media.findByIdAndDelete(id);
    return { status: 200, message: 'Media deleted successfully' };
  } catch (error) {
    return { status: 400, message: error.message };
  }
}

module.exports = {
  getMedia,
  createMedia,
  updateMedia,
  deleteMedia,
};

