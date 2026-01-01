const express = require('express')
const { direct } = require('../_helper/misc.js');
const { serverUpMessage } = require('../controller/rootController.js');
const router = express.Router();

router.get('/', direct(serverUpMessage));

module.exports = router;