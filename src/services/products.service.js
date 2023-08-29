import ProductsDao from "../daos/products.dao.js";

export class ProductsService {
    constructor() {
        this.dao = new ProductsDao();
    }

    getAll() {
        return this.dao.getAll();
    }

    getAllPage(searchQuery,limit,page,sort){
        return this.dao.getAllPage(searchQuery,limit,page,sort);
    }

    getProductById(pid) {
        return this.dao.getById(pid);
    }

    create(product){
        return this.dao.create(product);
    }

    editOne(pid, updatedProductData){
        return this.dao.editOne(pid, updatedProductData);
    }

    deleteOne(pid){
        return this.dao.deleteOne(pid);
    }




}