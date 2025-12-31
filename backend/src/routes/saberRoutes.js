const express = require('express');
const { direct } = require('../_helper/misc');
const { authenticateToken } = require('../_helper/auth');
const { getSabers, createSaber, updateSaber, deleteSaber } = require('../controller/saberController');
const router = express.Router();

router.get('/', direct(getSabers));
router.post('/', authenticateToken, direct(createSaber));
router.put('/:id', authenticateToken, direct(updateSaber));
router.delete('/:id', authenticateToken, direct(deleteSaber));

module.exports = router;

