const express = require('express');
const { addCompany, getAllCompanies } = require('../controllers/companyController');
const { verifyToken } = require('../utils/jwtUtils');
const router = express.Router();

// Route to add a new company
router.post('/company/add', addCompany);


// Route to get all companies
router.get('/companies', getAllCompanies);


module.exports = router;
