const express = require('express');
const { direct } = require('../_helper/misc');
const { authenticateToken } = require('../_helper/auth');
const { getDefaultWindow, createDefaultWindow, updateDefaultWindow, deleteDefaultWindow } = require('../controller/defaultWindowController');
const router = express.Router();

router.get('/', direct(getDefaultWindow));
router.post('/', authenticateToken, direct(createDefaultWindow));
router.put('/:id', authenticateToken, direct(updateDefaultWindow));
router.delete('/:id', authenticateToken, direct(deleteDefaultWindow));

module.exports = router;

