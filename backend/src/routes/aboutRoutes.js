const express = require('express');
const { direct } = require('../_helper/misc');
const { authenticateToken } = require('../_helper/auth');
const { getAbout, createAbout, updateAbout, deleteAbout } = require('../controller/aboutController');
const router = express.Router();

router.get('/', direct(getAbout));
router.post('/', authenticateToken, direct(createAbout));
router.put('/', authenticateToken, direct(updateAbout));
router.delete('/', authenticateToken, direct(deleteAbout));

module.exports = router;

