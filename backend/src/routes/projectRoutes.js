const express = require('express');
const { direct } = require('../_helper/misc');
const { getProjects } = require('../controller/projectController');
const router = express.Router();

router.get('/', direct(getProjects));

module.exports = router;

