import { readFileSync, writeFileSync } from 'fs';

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  addProduct(product) {
    const productList = this.readProductsFromFile();
    const nextId = this.getNextProductId(productList);
    product.id = nextId;
    productList.push(product);
    this.writeProductsToFile(productList);
  }

  getProducts() {
    return this.readProductsFromFile();
  }

  getProductById(id) {
    const productList = this.readProductsFromFile();
    return productList.find((product) => product.id === id);
  }

  updateProduct(id, updatedProduct) {
    const productList = this.readProductsFromFile();
    const index = productList.findIndex((product) => product.id === id);
    if (index !== -1) {
      updatedProduct.id = id;
      productList[index] = updatedProduct;
      this.writeProductsToFile(productList);
    }
  }

  deleteProduct(id) {
    const productList = this.readProductsFromFile();
    const index = productList.findIndex((product) => product.id === id);
    if (index !== -1) {
      productList.splice(index, 1);
      this.writeProductsToFile(productList);
    }
  }

  readProductsFromFile() {
    try {
      const data = readFileSync(this.path, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      return [];
    }
  }

  writeProductsToFile(productList) {
    const data = JSON.stringify(productList, null, 2);
    writeFileSync(this.path, data, 'utf8');
  }

  getNextProductId(productList) {
    const maxId = productList.reduce((max, product) => {
      return product.id > max ? product.id : max;
    }, 0);
    return maxId + 1;
  }
}

export {ProductManager};
