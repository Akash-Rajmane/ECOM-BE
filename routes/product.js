const express = require('express');
const router = express.Router();
const {getProducts,createProduct} = require('../controllers/product');
const checkAuth = require("../middlewares/auth");


router.get('/', getProducts);
router.post('/', checkAuth, createProduct)

module.exports = router;
