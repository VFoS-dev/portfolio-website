const express = require('express');
const { direct } = require('../_helper/misc');
const { getProjects, createProject, updateProject, deleteProject } = require('../controller/projectController');
const router = express.Router();

router.get('/', direct(getProjects));
router.post('/', direct(createProject));
router.put('/:id', direct(updateProject));
router.delete('/:id', direct(deleteProject));

module.exports = router;

