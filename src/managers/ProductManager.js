import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import __dirname from '../utils.js';

const PRODUCTS_FILE = path.join(__dirname, './products.json');

export async function getAllProducts() {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const products = JSON.parse(data);
    return products;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getProductById(productId) {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const products = JSON.parse(data);
    const product = products.find((p) => p.id === productId);
    return product;
  } catch (error) {
    throw error;
  }
}

export async function addProduct(newProductData) {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const products = JSON.parse(data);
    const productId = uuidv4();
    const product = { id: productId, ...newProductData };
    products.push(product);
    await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products));
    return { id: productId, ...product };
  } catch (error) {
    throw error;
  }
}

export async function updateProduct(productId, updatedProductData) {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const products = JSON.parse(data);
    const productIndex = products.findIndex((p) => p.id === productId);
    if (productIndex !== -1) {
      const updatedProduct = { id: productId, ...updatedProductData };
      products[productIndex] = updatedProduct;
      await fs.writeFile(PRODUCTS_FILE, JSON.stringify(products));
      return updatedProduct;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

export async function deleteProduct(productId) {
  try {
    const data = await fs.readFile(PRODUCTS_FILE, 'utf8');
    const products = JSON.parse(data);
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
}
