import express from 'express';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';

const app = express();
app.use(express.json());
const PORT = 8080;

// Rutas para el manejo de productos
const productsRouter = express.Router();
app.use('/api/products', productsRouter);

const PRODUCTS_FILE = 'products.json';


// Obtener todos los productos
productsRouter.get('/', (req, res) => {
  const limit = req.query.limit || 0;
  fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al leer el archivo de productos' });
      return;
    }

    const products = JSON.parse(data);
    const limitedProducts = limit > 0 ? products.slice(0, limit) : products;

    res.json(limitedProducts);
  });
});


// Obtener un producto por su id
productsRouter.get('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);

  fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al leer el archivo de productos' });
      return;
    }

    const products = JSON.parse(data);
    const product = products.find((p) => p.id === productId);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  });
});

// Agregar un nuevo producto
productsRouter.post('/', (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  const productId = uuidv4();

  if (!title || !description || !code || !price || !stock || !category) {
    res.status(400).json({ error: 'Faltan campos obligatorios' });
    return;
  }

  const newProduct = {
    id: productId,
    title,
    description,
    code,
    price,
    status: true,
    stock,
    category,
    thumbnails,
  };

  fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al leer el archivo de productos' });
      return;
    }

    const products = JSON.parse(data);
    products.push(newProduct);

    fs.writeFile(PRODUCTS_FILE, JSON.stringify(products), (err) => {
      if (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al guardar el producto' });
        return;
      }

      res.json(newProduct);
    });
  });
});

// Actualizar un producto por su id
productsRouter.put('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);
  const updatedFields = req.body;

  if (updatedFields.id) {
    delete updatedFields.id;
  }

  fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al leer el archivo de productos' });
      return;
    }

    const products = JSON.parse(data);
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      products[productIndex] = { ...products[productIndex], ...updatedFields };

      fs.writeFile(PRODUCTS_FILE, JSON.stringify(products), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error al actualizar el producto' });
          return;
        }

        res.json(products[productIndex]);
      });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  });
});

// Eliminar un producto por su id
productsRouter.delete('/:pid', (req, res) => {
  const productId = parseInt(req.params.pid);

  fs.readFile(PRODUCTS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al leer el archivo de productos' });
      return;
    }

    let products = JSON.parse(data);
    const productIndex = products.findIndex((p) => p.id === productId);

    if (productIndex !== -1) {
      products.splice(productIndex, 1);

      fs.writeFile(PRODUCTS_FILE, JSON.stringify(products), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error al eliminar el producto' });
          return;
        }

        res.sendStatus(204);
      });
    } else {
      res.status(404).json({ error: 'Producto no encontrado' });
    }
  });
});

// Rutas para el manejo de carritos
const cartsRouter = express.Router();
app.use('/api/carts', cartsRouter);

const CARTS_FILE = 'carrito.json';

// Crear un nuevo carrito
cartsRouter.post('/', (req, res) => {
  const cartId = uuidv4();
  const newCart = {
    id: cartId,
    products: [],
  };

  fs.writeFile(CARTS_FILE, JSON.stringify(newCart), (err) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al crear el carrito' });
      return;
    }

    res.json(newCart);
  });
});

// Obtener los productos de un carrito
cartsRouter.get('/:cid', (req, res) => {
  const cartId = req.params.cid;

  fs.readFile(CARTS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al leer el archivo de carrito' });
      return;
    }

    const cart = JSON.parse(data);

    if (cart.id === cartId) {
      res.json(cart.products);
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  });
});

// Agregar un producto al carrito
cartsRouter.post('/:cid/product/:pid', (req, res) => {
  const cartId = req.params.cid;
  const productId = parseInt(req.params.pid);

  fs.readFile(CARTS_FILE, 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).json({ error: 'Error al leer el archivo de carrito' });
      return;
    }

    const cart = JSON.parse(data);

    if (cart.id === cartId) {
      const existingProduct = cart.products.find((p) => p.id === productId);

      if (existingProduct) {
        existingProduct.quantity += 1;
      } else {
        cart.products.push({ id: productId, quantity: 1 });
      }

      fs.writeFile(CARTS_FILE, JSON.stringify(cart), (err) => {
        if (err) {
          console.error(err);
          res.status(500).json({ error: 'Error al actualizar el carrito' });
          return;
        }

        res.json(cart.products);
      });
    } else {
      res.status(404).json({ error: 'Carrito no encontrado' });
    }
  });
});


  app.listen(PORT, () => {
    console.log(`Servidor escuchando en el puerto ${PORT}`)
})

