import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import __dirname from '../utils.js';

const CARTS_FILE = path.join(__dirname, './carrito.json');

export async function createCart() {
  try {
    const newCart = {
      id: uuidv4(),
      products: [],
    };

    await fs.writeFile(CARTS_FILE, JSON.stringify(newCart));
    return newCart;
  } catch (error) {
    throw error;
  }
}

export async function getCartProducts(cartId) {
  try {
    const data = await fs.readFile(CARTS_FILE, 'utf8');
    const cart = JSON.parse(data);
    if (cart.id === cartId) {
      return cart.products;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}

export async function addProductToCart(cartId, productId, quantity) {
  try {
    const data = await fs.readFile(CARTS_FILE, 'utf8');
    let cart = JSON.parse(data);

    if (cart.id === cartId) {
      const existingProductIndex = cart.products.findIndex((p) => p.product === productId);

      if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({
          product: productId,
          quantity: quantity,
        });
      }

      await fs.writeFile(CARTS_FILE, JSON.stringify(cart));
      return cart.products;
    } else {
      return null;
    }
  } catch (error) {
    throw error;
  }
}
