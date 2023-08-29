import { productsModel } from "../models/product.model.js";

export default class ProductsDao {

    async getAll() {
        let products = await productsModel.find()
        return products;
    }

    async getAllPage(searchQuery,limit,page,sort){
        const product = await productsModel.paginate( searchQuery ,{
            limit:limit ?? 10,
            page: page ?? 1,  
            sort: { price: sort ?? "desc" }
        });
        return product;
    }

    async getById(pid){
        const product = await productsModel.findById(pid);
        return product;

    }

    async create(product){
        const productos = await productsModel.create(product);
        return productos;
    }


    async editOne(pid, updatedProductData){
        const updatedProduct = await productsModel.updateOne({_id:pid}, updatedProductData);
        return updatedProduct;
    }

    async deleteOne(pid){
        const deletedProduct = await productsModel.deleteOne({_id:pid});
        return deletedProduct;
    }


}