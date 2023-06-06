import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';


const PRODUCTS_FILE = 'products.json';

const productManager = {
  getAllProducts: async () => {
    try {
      const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
      const products = JSON.parse(data);
      return products;
    } catch (error) {
      throw error;
    }
  },

  getProductById: async (productId) => {
    try {
      const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
      const products = JSON.parse(data);
      const product = products.find((p) => p.id === productId);
      return product;
    } catch (error) {
      throw error;
    }
  },

  addProduct: async (productData) => {
    try {
      const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
      let products = JSON.parse(data);

      const newProduct = {
        id: uuidv4(),
        ...productData,
      };

      products.push(newProduct);

      await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products));
      return newProduct;
    } catch (error) {
      throw error;
    }
  },

  updateProduct: async (productId, updatedProductData) => {
    try {
      const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
      let products = JSON.parse(data);

      const productIndex = products.findIndex((p) => p.id === productId);
      if (productIndex !== -1) {
        products[productIndex] = {
          ...products[productIndex],
          ...updatedProductData,
        };

        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products));
        return products[productIndex];
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },

  deleteProduct: async (productId) => {
    try {
      const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
      let products = JSON.parse(data);

      const productIndex = products.findIndex((p) => p.id === productId);
      if (productIndex !== -1) {
        const deletedProduct = products.splice(productIndex, 1)[0];

        await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products));
        return deletedProduct;
      } else {
        return null;
      }
    } catch (error) {
      throw error;
    }
  },
};

export default productManager;