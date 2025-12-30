const express = require("express");
const router = express.Router();

// root
router.get('/', require('./rootRoutes.js'));

// data routes
router.use('/api/data', require('./dataRoutes.js'));

module.exports = router;