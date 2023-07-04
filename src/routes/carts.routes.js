import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { createCart, getCartProducts, addProductToCart } from '../managers/CartManager.js';

const cartsRouter = express.Router();

cartsRouter.post('/', async (req, res) => {
  try {
    const newCart = await createCart();
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create cart' });
  }
});

cartsRouter.get('/:cid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const cartProducts = await getCartProducts(cartId);
    if (cartProducts) {
      res.json(cartProducts);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
  }
});

cartsRouter.post('/:cid/product/:pid', async (req, res) => {
  try {
    const cartId = req.params.cid;
    const productId = req.params.pid;
    const quantity = 1; // Assuming we're adding one product at a time
    const cartProducts = await addProductToCart(cartId, productId, quantity);
    if (cartProducts) {
      res.json(cartProducts);
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to add product to cart' });
  }
});

export default cartsRouter;
