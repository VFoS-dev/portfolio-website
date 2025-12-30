const express = require('express');
const { direct } = require('../_helper/misc');
const { getDefaultWindow, createDefaultWindow, updateDefaultWindow, deleteDefaultWindow } = require('../controller/defaultWindowController');
const router = express.Router();

router.get('/', direct(getDefaultWindow));
router.post('/', direct(createDefaultWindow));
router.put('/:id', direct(updateDefaultWindow));
router.delete('/:id', direct(deleteDefaultWindow));

module.exports = router;

