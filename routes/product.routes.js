const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyToken } = require('../utils/jwtUtils');

router.post('/create-product', productController.createProduct);
router.post('/add-fund/:productId', productController.addFundToProduct);
router.get('/', productController.getProducts);
router.get('/:productId', productController.getProductById);
router.put('/:productId/refreshFunds', productController.refreshFundsInProduct);
router.post('/:productId/updateDailyValue', productController.updateDailyValue);
router.get('/:productId/getDailyValue',productController.getProductDailyValue);
module.exports = router;
