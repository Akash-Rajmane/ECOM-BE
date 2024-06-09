const express = require('express');

const cartController = require('../controllers/cart');
const auth = require('../middlewares/auth');

const router = express.Router();

router.get('/', auth, cartController.getCart);
router.post('/', auth, cartController.addToCart);
router.post('/update-cart', auth, cartController.updateCartOnLogin)
router.patch("/:id", auth, cartController.changeQuantityOfCartItem)
router.delete('/place-order', auth, cartController.placeOrder);
router.delete('/:id', auth, cartController.deleteItemFromCart);


module.exports = router;
