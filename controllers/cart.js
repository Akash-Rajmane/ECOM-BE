const Cart = require('../models/cart');



const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
        if (!cart) return res.json({items:[],totalAmount:0});
        
        const items = cart.products.map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            description: item.productId.description,
            price: item.productId.price,
            quantity: item.quantity
        }));
       // console.log(items);
        const dbCart = {
            items,
            totalAmount: cart.totalAmount
        };
        res.status(200).json(dbCart);
    } catch (err) {
        res.status(500).json({ error : 'Internal Server Error' });
    }
};

const addToCart = async (req, res) => {
    const { productId, quantity, price } = req.body;
     
    try {
        let cart = await Cart.findOne({ userId: req.user.id })
       
        if (!cart) {
         
            cart = new Cart({
                userId: req.user.id,
                products: [{ productId, quantity }],
                totalAmount: price * quantity
            });
        } else {
          
            const existingProduct = cart.products.filter(p =>{ 
                return p.productId._id.toString() === productId 
            });
          
            if (existingProduct.length === 0) {
                cart.products.push({ productId, quantity });
            } else {
             
                existingProduct[0].quantity += quantity;
            }
           
            cart.totalAmount += quantity*price;
        }
        
        await cart.save();
        
        const dbCart = {
            items: cart.products,
            totalAmount: cart.totalAmount,
        }
        res.status(200).json(dbCart);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const updateCartOnLogin = async (req,res) => {
    const { cartItems, amount } = req.body;

    try {
        
        let cart = await Cart.findOne({ userId: req.user.id });

        if (!cart) {
            cart = new Cart({ user: userId, items: [], totalAmount: 0 });
        }

        for (let item of cartItems) {
            
            const existingProductIndex = cart.products.findIndex(product => product.productId._id.toString() === item.id);
            if (existingProductIndex !== -1) {
                // If the product already exists in the cart, update its quantity
                cart.products[existingProductIndex].quantity += item.quantity;
            } else {
                // If the product is not in the cart, add it
                cart.products.push({ productId: item.id, quantity: item.quantity });
            }
        }

        cart.totalAmount += amount;

      
        await cart.save();

        const items = cart.products.map(item => ({
            id: item.productId._id,
            name: item.productId.name,
            description: item.productId.description,
            price: item.productId.price,
            quantity: item.quantity
        }));

        const dbCart = {
            items,
            totalAmount: cart.totalAmount
        };

        res.status(200).json(dbCart);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error : 'Internal Server Error' });
    }
}


const changeQuantityOfCartItem = async (req, res) => {
    const productId = req.params.id;
    const {quantity,prevQuantity,price} = req.body; 
    
    
    try {
        let cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

       
        const productIndex = cart.products.findIndex(el => el.productId._id.toString() === productId);
        if (productIndex === -1) {
            return res.status(404).json({ error: 'Product not found in cart' });
        }
        
        cart.products[productIndex].quantity = parseFloat(quantity);
       
        cart.totalAmount += (parseFloat(quantity) - parseFloat(prevQuantity))*parseFloat(price)

        await cart.save();

        const dbCart = {
            items: cart.products,
            totalAmount: cart.totalAmount
        };

        res.status(200).json(dbCart);

    } catch (err) {
        console.error('Error updating cart item quantity:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


const placeOrder = async (req, res) => {
   
    try {
        const cart = await Cart.findOne({ userId: req.user.id })
        
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        
        const len = cart.products.length;

        cart.products.splice(0,len);

        cart.totalAmount = 0;
        
        await cart.save();
        
        const dbCart = {
            items: cart.products,
            totalAmount: cart.totalAmount
        };
        
        res.status(200).json(dbCart);
    } catch (err) {
        console.error('Error clearing cart:', err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};





const deleteItemFromCart = async (req, res) => {
    const productId = req.params.id;
    try {
        let cart = await Cart.findOne({ userId: req.user.id }).populate('products.productId');
        if (!cart) return res.status(404).json({ error: 'Cart not found' });

        const productIndex = cart.products.findIndex(p => p.productId._id.toString() === productId);
       
        if(productIndex===-1){
            return res.status(404).json({error:"product not found in cart"});
        }

        cart.products.splice(productIndex,1)

       
        cart.totalAmount = cart.products.reduce((acc, el) => acc + (el.productId.price * el.quantity), 0);

        await cart.save();

        const dbCart = {
            items: cart.products,
            totalAmount: cart.totalAmount
        }
        res.status(200).json(dbCart);
    } catch (err) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
};




module.exports = { getCart, addToCart, updateCartOnLogin, changeQuantityOfCartItem, deleteItemFromCart, placeOrder };
