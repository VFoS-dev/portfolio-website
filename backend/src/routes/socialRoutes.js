const express = require('express');
const { direct } = require('../_helper/misc');
const { getSocials } = require('../controller/socialController');
const router = express.Router();

router.get('/', direct(getSocials));

module.exports = router;

