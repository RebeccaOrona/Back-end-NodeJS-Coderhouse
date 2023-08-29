import express from 'express';
import { addToCart, createCart, deleteAllProducts, deleteProduct, editCart, editProductInCart, getCart } from '../controllers/carts.controller.js';

const cartsRouter = express.Router();

cartsRouter.post('/', createCart);

cartsRouter.post('/:cid/product/:pid', addToCart);

cartsRouter.get('/:cid', getCart);

cartsRouter.delete('/:cid/product/:pid', deleteProduct);

cartsRouter.put('/:cid', editCart)

cartsRouter.put('/:cid/product/:pid', editProductInCart);

cartsRouter.delete('/:cid', deleteAllProducts)

export default cartsRouter;
