import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

const CARTS_FILE = 'carrito.json';

const cartManager = {
  createCart: async () => {
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
  },

  getCartProducts: async (cartId) => {
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
  },

  addProductToCart: async (cartId, productId) => {
    try {
      const data = await fs.readFile(CARTS_FILE, 'utf8');
      let cart = JSON.parse(data);

      if (cart.id === cartId) {
        const existingProductIndex = cart.products.findIndex((p) => p.product === productId);

        if (existingProductIndex !== -1) {
          cart.products[existingProductIndex].quantity += 1;
        } else {
          cart.products.push({
            product: productId,
            quantity: 1,
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
  },
};


export default cartManager;