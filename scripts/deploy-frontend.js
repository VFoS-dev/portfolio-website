const { S3Client, PutObjectCommand, ListObjectsV2Command, DeleteObjectCommand } = require('@aws-sdk/client-s3');
const { CloudFrontClient, CreateInvalidationCommand } = require('@aws-sdk/client-cloudfront');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const BUCKET_NAME = process.env.AWS_FRONTEND_BUCKET;
const AWS_REGION = process.env.AWS_REGION || 'us-west-2';
const CLOUDFRONT_DISTRIBUTION_ID = process.env.AWS_FRONTEND_CLOUDFRONT_DISTRIBUTION_ID;

if (!BUCKET_NAME) {
  console.error('Error: AWS_FRONTEND_BUCKET environment variable is required');
  process.exit(1);
}

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const cloudFrontClient = new CloudFrontClient({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

async function uploadFile(localPath, s3Key) {
  const fileContent = fs.readFileSync(localPath);
  const contentType = getContentType(localPath);

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
    Body: fileContent,
    ContentType: contentType,
    CacheControl: getCacheControl(localPath),
  });

  await s3Client.send(command);
  console.log(`✓ Uploaded: ${s3Key}`);
}

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.otf': 'font/otf',
  };
  return contentTypes[ext] || 'application/octet-stream';
}

function getCacheControl(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  // Cache static assets for 1 year, HTML for 1 hour
  if (['.html'].includes(ext)) {
    return 'public, max-age=3600';
  }
  return 'public, max-age=31536000, immutable';
}

async function getAllS3Keys() {
  const keys = [];
  let continuationToken = undefined;

  do {
    const command = new ListObjectsV2Command({
      Bucket: BUCKET_NAME,
      ContinuationToken: continuationToken,
    });

    const response = await s3Client.send(command);
    if (response.Contents) {
      keys.push(...response.Contents.map((obj) => obj.Key));
    }
    continuationToken = response.NextContinuationToken;
  } while (continuationToken);

  return keys;
}

async function deleteFile(s3Key) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: s3Key,
  });

  await s3Client.send(command);
  console.log(`✓ Deleted: ${s3Key}`);
}

async function deploy() {
  const distPath = path.join(__dirname, '..', 'frontend', 'dist');

  if (!fs.existsSync(distPath)) {
    console.error(`Error: Build directory not found: ${distPath}`);
    console.error('Please run "npm run build" first');
    process.exit(1);
  }

  console.log(`Deploying frontend to S3 bucket: ${BUCKET_NAME}`);
  console.log(`Region: ${AWS_REGION}`);

  // Get all files in dist directory recursively
  function getAllFiles(dir, fileList = []) {
    const files = fs.readdirSync(dir);
    files.forEach((file) => {
      const filePath = path.join(dir, file);
      if (fs.statSync(filePath).isDirectory()) {
        getAllFiles(filePath, fileList);
      } else {
        fileList.push(path.relative(distPath, filePath));
      }
    });
    return fileList;
  }

  const files = getAllFiles(distPath);

  console.log(`\nFound ${files.length} files to upload\n`);

  // Upload all files
  for (const file of files) {
    const localPath = path.join(distPath, file);
    const s3Key = file.replace(/\\/g, '/'); // Normalize path separators
    await uploadFile(localPath, s3Key);
  }

  // Optionally: Clean up old files (files in S3 that don't exist in dist)
  // This is commented out by default to prevent accidental deletions
  // Uncomment if you want to sync (delete files in S3 that aren't in dist)
  /*
  const s3Keys = await getAllS3Keys();
  const distKeys = new Set(files.map(f => f.replace(/\\/g, '/')));
  const keysToDelete = s3Keys.filter(key => !distKeys.has(key));
  
  if (keysToDelete.length > 0) {
    console.log(`\nDeleting ${keysToDelete.length} old files from S3...`);
    for (const key of keysToDelete) {
      await deleteFile(key);
    }
  }
  */

  console.log(`\n✓ Deployment complete!`);
  console.log(`Frontend available at: https://${BUCKET_NAME}`);

  // Invalidate CloudFront cache if distribution ID is provided
  if (CLOUDFRONT_DISTRIBUTION_ID) {
    console.log(`\nInvalidating CloudFront cache for distribution: ${CLOUDFRONT_DISTRIBUTION_ID}`);
    try {
      const invalidationCommand = new CreateInvalidationCommand({
        DistributionId: CLOUDFRONT_DISTRIBUTION_ID,
        InvalidationBatch: {
          CallerReference: `frontend-deploy-${Date.now()}`,
          Paths: {
            Quantity: 1,
            Items: ['/*'],
          },
        },
      });

      const invalidationResponse = await cloudFrontClient.send(invalidationCommand);
      console.log(`✓ CloudFront invalidation created: ${invalidationResponse.Invalidation?.Id}`);
      console.log(`  Status: ${invalidationResponse.Invalidation?.Status}`);
    } catch (error) {
      console.error('Warning: Failed to create CloudFront invalidation:', error.message);
      console.log('  Deployment succeeded, but cache may not be invalidated');
    }
  } else {
    console.log('\nNote: AWS_FRONTEND_CLOUDFRONT_DISTRIBUTION_ID not set, skipping CloudFront invalidation');
  }
}

deploy().catch((error) => {
  console.error('Deployment failed:', error);
  process.exit(1);
});

