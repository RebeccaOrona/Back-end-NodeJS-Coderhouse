import { Router } from 'express';
import productsRouter from './products.routes.js';

const router = Router();

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/', (req, res) => {
    res.render('profile', {
        user: req.session.user
    });
})

viewsRouter.use('/products', productsRouter);
  

  // Ruta para la vista "realTimeProducts.handlebars" (lista de productos en tiempo real)
viewsRouter.get('/realtimeproducts', async (req, res) => {
    try {
      const products = await getAllProducts();
      res.render('realTimeProducts', { products });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });

export default router;