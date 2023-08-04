import express from 'express';
import { cartsModel } from '../models/cart.model.js';

const cartsRouter = express.Router();

cartsRouter.post('/', async (req, res) => {
  try {
  const cartData = {};
    let result = await cartsModel.create(cartData);
    res.send({ status: "success",  cartId: result._id, payload: result });
  } catch (error) {
    console.error("Cart creation failed:", error);
    res.status(500).send({ status: "error", error: "Failed to create cart" });
  }
  
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    let {cid, pid} = req.params;
    let cart = await cartsModel.findById(cid);
    let products = cart.products;
    const productIndex = products.findIndex((product) => product.product === pid);
    if (productIndex !== -1) {
      // Product already exists in the cart, increment its quantity by 1
      products[productIndex].quantity += 1;
    } else {
      // Product does not exist in the cart, add it with quantity 1
      products.push({
        product: pid,
        quantity: 1
      });
    }
    await cart.save();
    res.send({status:"success",payload:cart});
  } catch (error) {
    res.status(500).send({ status: "error", error: 'Failed to add product to cart' });
    console.log(error);
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  try {
    let {cid} = req.params;
    let cart = await cartsModel.findById(cid).populate('products.product');
    if (cart) {
      res.render('cart', { cart });
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

cartsRouter.delete('/:cid/products/:pid', async (req, res) => {
  let { cid, pid } = req.params
  try{

    let cart = await cartsModel.findById(cid);
    let productIndex = cart.products.findIndex(product => product.product === pid);
    
    if (productIndex !== -1) {
      // Remove the product from the products array
      cart.products.splice(productIndex, 1);

      // Save the updated cart document
      await cart.save();

      res.send({ status: "success", message: "Product deleted from cart" });
    } else {
      res.status(404).send({ status: "error", message: "Product not found in cart" });
    }
  } catch (error) {
    res.status(500).send({ status: "error", message: "Failed to delete product from cart" });
  }
});

  

cartsRouter.put('/:cid', async (req, res) => {
  try{
  let {cid} = req.params;
  let cart = await cartsModel.findById(cid);
  let products = req.body;
  cart.products = products;
  await cart.save();
  res.send({ status: 'success', message: 'Cart updated successfully' });
  } catch (error) {
    res.status(500).send({ status: "error", message: "Failed to update cart" });
  }
})


cartsRouter.put('/:cid/products/:pid', async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    const cart = await cartsModel.findById(cid);
    if (!cart) {
      return res.status(404).send({ status: 'error', message: 'Cart not found' });
    }

    const productIndex = cart.products.findIndex(product => product.product.toString() === pid);
    if (productIndex === -1) {
      return res.status(404).send({ status: 'error', message: 'Product not found in cart' });
    }

    cart.products[productIndex].quantity = quantity;
    await cart.save();

    res.send({ status: 'success', message: 'Product quantity updated in cart' });
  } catch (error) {
    res.status(500).send({ status: 'error', message: 'Failed to update product quantity in cart' });
  }
});

cartsRouter.delete('/:cid', async (req, res) => {
  let {cid} = req.params;
  let cart = await cartsModel.findById(cid);
  cart.products = [];
  await cart.save();
  res.send({ status: 'success', message: 'All products deleted from the cart' });
})

export default cartsRouter;
