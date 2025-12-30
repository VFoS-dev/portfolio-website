const express = require('express');
const { direct } = require('../_helper/misc');
const { getIcons, createIcon, updateIcon, deleteIcon } = require('../controller/iconController');
const router = express.Router();

router.get('/', direct(getIcons));
router.post('/', direct(createIcon));
router.put('/:id', direct(updateIcon));
router.delete('/:id', direct(deleteIcon));

module.exports = router;

