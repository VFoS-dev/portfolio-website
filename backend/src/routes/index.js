const express = require("express");
const router = express.Router();

// root
router.get('/', require('./rootRoutes.js'))

module.exports = router;