const express = require('express');
const { direct } = require('../_helper/misc');
const { getSocials, createSocial, updateSocial, deleteSocial } = require('../controller/socialController');
const router = express.Router();

router.get('/', direct(getSocials));
router.post('/', direct(createSocial));
router.put('/:id', direct(updateSocial));
router.delete('/:id', direct(deleteSocial));

module.exports = router;

