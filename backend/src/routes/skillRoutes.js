const express = require('express');
const { direct } = require('../_helper/misc');
const { getSkills } = require('../controller/skillController');
const router = express.Router();

router.get('/', direct(getSkills));

module.exports = router;

