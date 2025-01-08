const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken } = require('../utils/jwtUtils');
const multer = require('multer');
const path = require('path');

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Ensure uploads directory exists
    const uploadDir = 'uploads/';
    require('fs').mkdirSync(uploadDir, { recursive: true });
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage: storage });

// Routes
router.post('/create-product', upload.single('iconImage'), productController.createProduct);
router.patch('/update-product/:productId', productController.updateProduct);
router.post('/add-fund/:productId', productController.addFundToProduct);
router.get('/', productController.getProducts);
router.get('/:productId', productController.getProductById);
router.put('/:productId/refreshFunds', productController.refreshFundsInProduct);
router.post('/:productId/updateDailyValue', productController.updateDailyValue);
router.get('/:productId/getDailyValue', productController.getProductDailyValue);

module.exports = router;