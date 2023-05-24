import express from 'express';
import { ProductManager } from './ProductManager.js';

const app = express();
const productManager = new ProductManager('products.json');
app.use(express.urlencoded({extended:true}));
// app.use(express.json());


app.get('/products', async (req, res) => {
    try {
      const limit = req.query.limit;
      const products = await productManager.getProducts();
  
      if (limit) {
        const limitedProducts = products.slice(0, limit);
        res.json(limitedProducts);
      } else {
        res.json(products);
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.get('/products/:pid', async (req, res) => {
    try {
      const productId = req.params.pid;
      const product = await productManager.getProductById(parseInt(productId));
      
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  app.listen(8080, () => {
    console.log('servidor escuchando en el puerto 8080')
})