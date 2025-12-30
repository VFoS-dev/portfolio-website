const express = require('express');
const { direct } = require('../_helper/misc');
const { getSkills, createSkill, updateSkill, deleteSkill } = require('../controller/skillController');
const router = express.Router();

router.get('/', direct(getSkills));
router.post('/', direct(createSkill));
router.put('/:id', direct(updateSkill));
router.delete('/:id', direct(deleteSkill));

module.exports = router;

