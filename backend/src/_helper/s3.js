const { S3Client, PutObjectCommand, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { env } = require('./env');
const crypto = require('crypto');
const path = require('path');

// Initialize S3 client
const s3Client = new S3Client({
  region: env('AWS_REGION', 'us-east-1'),
  credentials: {
    accessKeyId: env('AWS_ACCESS_KEY_ID', ''),
    secretAccessKey: env('AWS_SECRET_ACCESS_KEY', ''),
  },
});

const BUCKET_NAME = env('AWS_S3_BUCKET_NAME', '');

/**
 * Upload a file to S3
 * @param {Buffer} fileBuffer - File buffer
 * @param {String} originalName - Original filename
 * @param {String} mimeType - MIME type
 * @returns {Promise<{url: String, key: String}>}
 */
async function uploadToS3(fileBuffer, originalName, mimeType) {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  // Generate unique filename
  const ext = path.extname(originalName);
  const baseName = path.basename(originalName, ext);
  const hash = crypto.randomBytes(8).toString('hex');
  const key = `media/${baseName}-${hash}${ext}`;

  // Upload to S3
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileBuffer,
    ContentType: mimeType,
    ACL: 'public-read', // Make file publicly accessible
  });

  await s3Client.send(command);

  // Construct public URL
  const url = `https://${BUCKET_NAME}.s3.${env('AWS_REGION', 'us-east-1')}.amazonaws.com/${key}`;

  return { url, key };
}

/**
 * Delete a file from S3
 * @param {String} key - S3 object key
 * @returns {Promise<void>}
 */
async function deleteFromS3(key) {
  if (!BUCKET_NAME) {
    throw new Error('AWS_S3_BUCKET_NAME is not configured');
  }

  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
  });

  await s3Client.send(command);
}

/**
 * Extract S3 key from URL
 * @param {String} url - S3 URL
 * @returns {String} - S3 key
 */
function extractKeyFromUrl(url) {
  if (!url) return null;
  // Extract key from URL like: https://bucket.s3.region.amazonaws.com/media/filename.ext
  const match = url.match(/\.amazonaws\.com\/(.+)$/);
  return match ? match[1] : null;
}

module.exports = {
  uploadToS3,
  deleteFromS3,
  extractKeyFromUrl,
};

