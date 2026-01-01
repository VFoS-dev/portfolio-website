const express = require('express');
const { direct } = require('../_helper/misc');
const { authenticateToken } = require('../_helper/auth');
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controller/skillController');
const router = express.Router();

router.get('/', direct(getSkills));
router.post('/', authenticateToken, direct(createSkill));
router.put('/:id', authenticateToken, direct(updateSkill));
router.delete('/:id', authenticateToken, direct(deleteSkill));

module.exports = router;

