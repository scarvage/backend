const Company = require('../models/companyModel');

// Add new company to the database
const addCompany = async (req, res) => {
  const { nseSymbol, yahooSymbol, isinNumber, nameOfCompany, industry } = req.body;

  try {
    const newCompany = new Company({
      nseSymbol,
      yahooSymbol,
      isinNumber,
      nameOfCompany,
      industry,
    });

    await newCompany.save();
    res.status(201).send('Company added successfully');
  } catch (error) {
    res.status(500).send('Error adding company: ' + error.message);
  }
};

// Get all companies
const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    res.status(500).send('Error retrieving companies: ' + error.message);
  }
};




module.exports = { addCompany, getAllCompanies };
