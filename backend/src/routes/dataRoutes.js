const express = require('express');
const { direct } = require('../_helper/misc');
const {
  getIcons,
  getDefaultWindow,
  getAboutData,
  getProjects,
  getSkills,
  getColors,
  getSocials,
} = require('../controller/dataController');
const router = express.Router();

router.get('/icons', direct(getIcons));
router.get('/default-window', direct(getDefaultWindow));
router.get('/about', direct(getAboutData));
router.get('/projects', direct(getProjects));
router.get('/skills', direct(getSkills));
router.get('/colors', direct(getColors));
router.get('/socials', direct(getSocials));

module.exports = router;

