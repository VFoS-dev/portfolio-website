const express = require('express');
const { direct } = require('../_helper/misc');
const { authenticateToken } = require('../_helper/auth');
const { getProjects, createProject, updateProject, deleteProject } = require('../controller/projectController');
const router = express.Router();

router.get('/', direct(getProjects));
router.post('/', authenticateToken, direct(createProject));
router.put('/:id', authenticateToken, direct(updateProject));
router.delete('/:id', authenticateToken, direct(deleteProject));

module.exports = router;

