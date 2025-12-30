const express = require('express');
const { direct } = require('../_helper/misc');
const { getIcons } = require('../controller/iconController');
const router = express.Router();

router.get('/', direct(getIcons));

module.exports = router;

