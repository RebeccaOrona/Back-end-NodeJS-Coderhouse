import express from 'express';
import productManager from '../ProductManager.js'


const productsRouter = express.Router();


// Obtener todos los productos
productsRouter.get('/', async (req, res) => {
    try {
      const products = await productManager.getAllProducts();
      res.json(products);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });
  
  
  // Obtener un producto por su id
productsRouter.get('/:pid', async (req, res) => {
    const productId = req.params.pid;
  
    try {
      const product = await productManager.getProductById(productId);
      if (product) {
        res.json(product);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el producto' });
    }
  });


  // Agregar un nuevo producto
productsRouter.post('/', async (req, res) => {
    const newProductData = req.body;
  
    try {
      const newProduct = await productManager.addProduct(newProductData);
      res.json(newProduct);
    } catch (error) {
      res.status(500).json({ error: 'Error al agregar el producto' });
    }
  });

  
  // Actualizar un producto por su id
productsRouter.put('/:pid', async (req, res) => {
    const productId = req.params.pid;
    const updatedProductData = req.body;
  
    try {
      const updatedProduct = await productManager.updateProduct(productId, updatedProductData);
      if (updatedProduct) {
        res.json(updatedProduct);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar el producto' });
    }
  });
  

  // Eliminar un producto por su id
productsRouter.delete('/:pid', async (req, res) => {
    const productId = req.params.pid;
  
    try {
      const deletedProduct = await productManager.deleteProduct(productId);
      if (deletedProduct) {
        // res.statusCode(200).send("Producto eliminado exitosamente");
        res.json(deletedProduct);
      } else {
        res.status(404).json({ error: 'Producto no encontrado' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar el producto' });
    }
  });
  
  
  
export default productsRouter;