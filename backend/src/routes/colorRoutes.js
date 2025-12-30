const express = require('express');
const { direct } = require('../_helper/misc');
const { getColors, createColor, updateColor, deleteColor } = require('../controller/colorController');
const router = express.Router();

router.get('/', direct(getColors));
router.post('/', direct(createColor));
router.put('/:id', direct(updateColor));
router.delete('/:id', direct(deleteColor));

module.exports = router;

