const express = require('express');
const multer = require('multer');
const { direct } = require('../_helper/misc');
const { authenticateToken } = require('../_helper/auth');
const { getMedia, createMedia, updateMedia, deleteMedia } = require('../controller/mediaController');
const router = express.Router();

// Configure multer for memory storage (we'll upload directly to S3)
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 100 * 1024 * 1024, // 100MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images and videos
    if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images and videos are allowed'), false);
    }
  },
});

router.get('/', direct(getMedia));
router.post('/', authenticateToken, upload.single('file'), direct(createMedia));
router.put('/:id', authenticateToken, direct(updateMedia));
router.delete('/:id', authenticateToken, direct(deleteMedia));

module.exports = router;

