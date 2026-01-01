const express = require('express');
const { direct } = require('../_helper/misc');
const { authenticateToken } = require('../_helper/auth');
const { getSocials, createSocial, updateSocial, deleteSocial } = require('../controller/socialController');
const router = express.Router();

router.get('/', direct(getSocials));
router.post('/', authenticateToken, direct(createSocial));
router.put('/:id', authenticateToken, direct(updateSocial));
router.delete('/:id', authenticateToken, direct(deleteSocial));

module.exports = router;

