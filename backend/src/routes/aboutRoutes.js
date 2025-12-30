const express = require('express');
const { direct } = require('../_helper/misc');
const { getAbout, createAbout, updateAbout, deleteAbout } = require('../controller/aboutController');
const router = express.Router();

router.get('/', direct(getAbout));
router.post('/', direct(createAbout));
router.put('/:id', direct(updateAbout));
router.delete('/:id', direct(deleteAbout));

module.exports = router;

