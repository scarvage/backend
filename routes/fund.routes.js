const express = require('express');
const router = express.Router();
const fundController = require('../controllers/fund.controller');
const { verifyToken } = require('../utils/jwtUtils');
const multer = require('multer');
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/') // Make sure this directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname)
  }
});
const upload = multer({ storage: storage });
// Route to add a fund to a product
router.post('/add-fund/:productId',upload.single('icon'), fundController.addFundToProduct);

// Route to get all funds
router.get('/', fundController.getAllFunds);

// Route to get fund details
router.get('/:fundId', fundController.getFundDetails);

// Route to delete a fund by ID
router.delete('/:fundId', fundController.deleteFund);
router.patch('/funds/:fundId/icon', upload.single('icon'), fundController.updateFundIcon);
module.exports = router;
