const express = require('express');
const { direct } = require('../_helper/misc');
const { getDefaultWindow } = require('../controller/defaultWindowController');
const router = express.Router();

router.get('/', direct(getDefaultWindow));

module.exports = router;

