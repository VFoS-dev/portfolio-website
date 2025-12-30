const express = require('express');
const { direct } = require('../_helper/misc');
const { authenticateToken } = require('../_helper/auth');
const { getColors, createColor, updateColor, deleteColor } = require('../controller/colorController');
const router = express.Router();

router.get('/', direct(getColors));
router.post('/', authenticateToken, direct(createColor));
router.put('/:id', authenticateToken, direct(updateColor));
router.delete('/:id', authenticateToken, direct(deleteColor));

module.exports = router;

