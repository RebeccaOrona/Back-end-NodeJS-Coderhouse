import { Router } from 'express';
import productsRouter from './products.routes.js';

const viewsRouter = Router();

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
  
export default viewsRouter;