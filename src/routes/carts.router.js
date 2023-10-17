import express from 'express';
import { addToCart, createCart, deleteAllProducts, removeFromCart, editCart, editProductInCart, findCartByPurchaser, getCart, purchaseCart } from '../controllers/carts.controller.js';
import { passportCall } from '../utils.js';

const cartsRouter = express.Router();

cartsRouter.post('/', passportCall('jwt'), createCart);

cartsRouter.get('/findCartByPurchaser/:purchaser', findCartByPurchaser);

cartsRouter.post('/:cid/product/:pid', passportCall('jwt'), addToCart);

cartsRouter.get('/:cid', getCart);

cartsRouter.delete('/:cid/product/:pid', passportCall('jwt'), removeFromCart);

cartsRouter.put('/:cid', passportCall('jwt'), editCart)

cartsRouter.put('/:cid/product/:pid', passportCall('jwt'), editProductInCart);

cartsRouter.delete('/:cid', deleteAllProducts)

cartsRouter.post('/:cid/purchase', purchaseCart)

export default cartsRouter;
