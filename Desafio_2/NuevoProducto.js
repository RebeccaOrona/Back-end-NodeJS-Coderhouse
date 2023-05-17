
import { ProductManager } from './ProductManager.js';

const productManager = new ProductManager('products.json');

productManager.addProduct({
  title: "Producto 1",
  description: "Descripción del producto 1",
  price: 10,
  thumbnail: "ruta/de/imagen/1",
  code: "001",
  stock: 5
});

productManager.addProduct({
  title: "Producto 2",
  description: "Descripción del producto 2",
  price: 20,
  thumbnail: "ruta/de/imagen/2",
  code: "002",
  stock: 10
});

console.log(productManager.getProducts());

const product = productManager.getProductById(2);
console.log(product);
