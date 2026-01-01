const express = require('express');
const { direct } = require('../_helper/misc');
const { authenticateToken } = require('../_helper/auth');
const { getIcons, createIcon, updateIcon, deleteIcon } = require('../controller/iconController');
const router = express.Router();

router.get('/', direct(getIcons));
router.post('/', authenticateToken, direct(createIcon));
router.put('/:id', authenticateToken, direct(updateIcon));
router.delete('/:id', authenticateToken, direct(deleteIcon));

module.exports = router;

