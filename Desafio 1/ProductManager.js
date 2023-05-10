
class ProductManager {
  constructor(products = []) {
    this.products = products;
    this.idCounter = 1;
  }

  addProduct(product) {
    // Validar que todos los campos sean obligatorios
    if (!product.title || !product.description || !product.price || !product.thumbnail || !product.code || !product.stock) {
      console.error("Todos los campos son obligatorios");
      return;
    }

    // Validar que no se repita el campo "code"
    if (this.products.some(p => p.code === product.code)) {
      console.error("El código del producto ya existe");
      return;
    }

    // Asignar un id autoincrementable
    product.id = this.idCounter++;

    this.products.push(product);
  }

  getProducts() {
    return this.products;
  }

  getProductById(id) {
    const product = this.products.find(p => p.id === id);

    if (!product) {
      console.error("Producto no encontrado");
    }

    return product;
  }
}
