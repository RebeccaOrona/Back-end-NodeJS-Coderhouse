import { Router } from 'express';
import productsRouter from './products.routes.js';

const router = Router();

router.get('/register', (req, res) => {
    res.render('register');
})

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/profile', (req, res) => {
    res.render('profile', {
        user: req.session.user
    });
})

router.get('/logout', (req, res) => {
  res.render('logout');
})


router.use('/products', productsRouter);
  

  // Ruta para la vista "realTimeProducts.handlebars" (lista de productos en tiempo real)
router.get('/realtimeproducts', async (req, res) => {
    try {
      const products = await getAllProducts();
      res.render('realTimeProducts', { products });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });

export default router;