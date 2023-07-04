import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import { getAllProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../managers/ProductManager.js';

const productsRouter = express.Router();

productsRouter.get('/', async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

productsRouter.get('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const product = await getProductById(productId);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

productsRouter.post('/', async (req, res) => {
  try {
    const newProduct = req.body;
    const product = await addProduct(newProduct);
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

productsRouter.put('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const updatedProductData = req.body;
    const updatedProduct = await updateProduct(productId, updatedProductData);
    if (updatedProduct) {
      res.json(updatedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const productId = req.params.pid;
    const deletedProduct = await deleteProduct(productId);
    if (deletedProduct) {
      res.json(deletedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default productsRouter;
