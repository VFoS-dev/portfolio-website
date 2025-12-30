const express = require('express');
const { direct } = require('../_helper/misc');
const { getAbout } = require('../controller/aboutController');
const router = express.Router();

router.get('/', direct(getAbout));

module.exports = router;

