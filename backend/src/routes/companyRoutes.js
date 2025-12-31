const express = require('express');
const { direct } = require('../_helper/misc');
const { authenticateToken } = require('../_helper/auth');
const { getCompanies, createCompany, updateCompany, deleteCompany } = require('../controller/companyController');
const router = express.Router();

router.get('/', direct(getCompanies));
router.post('/', authenticateToken, direct(createCompany));
router.put('/:id', authenticateToken, direct(updateCompany));
router.delete('/:id', authenticateToken, direct(deleteCompany));

module.exports = router;

