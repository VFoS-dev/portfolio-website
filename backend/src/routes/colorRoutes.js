const express = require('express');
const { direct } = require('../_helper/misc');
const { getColors } = require('../controller/colorController');
const router = express.Router();

router.get('/', direct(getColors));

module.exports = router;

