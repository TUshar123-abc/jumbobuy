const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { verifyAccessToken } = require("../Helpers/jwt_helper");

router.get('/', verifyAccessToken, productController.getAllProducts);

router.get('/:id', verifyAccessToken, productController.getProductById);

router.post('/', verifyAccessToken, productController.createProduct);

router.put('/:id', verifyAccessToken, productController.updateProduct);

router.delete('/:id', verifyAccessToken, productController.deleteProduct);

module.exports = router;
