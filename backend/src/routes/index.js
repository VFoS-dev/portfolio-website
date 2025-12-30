const express = require("express");
const router = express.Router();

// root
router.get('/', require('./rootRoutes.js'));

// auth routes (public)
router.use('/api/auth', require('./authRoutes.js'));

// data routes (GET is public, CUD requires auth)
router.use('/api/icons', require('./iconRoutes.js'));
router.use('/api/default-window', require('./defaultWindowRoutes.js'));
router.use('/api/about', require('./aboutRoutes.js'));
router.use('/api/projects', require('./projectRoutes.js'));
router.use('/api/skills', require('./skillRoutes.js'));
router.use('/api/colors', require('./colorRoutes.js'));
router.use('/api/socials', require('./socialRoutes.js'));

module.exports = router;