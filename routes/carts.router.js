import express from 'express';
import cartManager from '../CartManager.js'


const cartsRouter = express.Router();


// Crear un nuevo carrito
cartsRouter.post('/', async (req, res) => {
    try {
      const newCart = await cartManager.createCart();
      res.json(newCart);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear el carrito' });
    }
  });
  
  // Obtener los productos de un carrito
cartsRouter.get('/:cid', async (req, res) => {
    const cartId = req.params.cid;
  
    try {
      const cartProducts = await cartManager.getCartProducts(cartId);
      if (cartProducts) {
        res.json(cartProducts);
      } else {
        res.status(404).json({ error: 'Carrito no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos del carrito' });
    }
  });
  
  // Agregar un producto al carrito
cartsRouter.post('/:cid/product/:pid', async (req, res) => {
    const cartId = req.params.cid;
    const productId = req.params.pid;
  
    try {
      const updatedCartProducts = await cartManager.addProductToCart(cartId, productId);
      res.json(updatedCartProducts);
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
  });
  
  
export default cartsRouter;
