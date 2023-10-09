import { productsModel } from "../models/product.model.js";
import { generateProduct } from "../utils.js";
import CustomError from "../services/customErrors.js";
import EErrors from "../services/enums.js";
import { generatePidErrorInfo } from "../services/info.js";

export default class ProductsDao {

    async getAll() {
        let products = await productsModel.find()
        return products;
    }

    async getAllPage(querysearch,queryvalue,limit,page,sort){
        let searchQuery = {};
        if (querysearch && queryvalue) {
            searchQuery[querysearch] = queryvalue;
        }
        const product = await productsModel.paginate( searchQuery ,{
            limit:limit ?? 10,
            page: page ?? 1,  
            sort: { price: sort ?? "desc" }
        });
        return product;
    }

    async getById(pid){
        try{
            const product = await productsModel.findById(pid);
            return product;
        } catch (error){
            CustomError.createError({
                name:"Failed getting the product",
                cause:generatePidErrorInfo(pid),
                message:"Product not found",
                code:EErrors.DATABASE_ERROR
            })
        }
    }

    async create(product){
        const productos = await productsModel.create(product);
        return productos;
    }


    async editOne(pid, updatedProductData){
    try{
        const updatedProduct = await productsModel.updateOne({_id:pid}, updatedProductData);
        return updatedProduct;
    } catch (error){
        CustomError.createError({
            name:"Failed updating the product",
            cause:generatePidErrorInfo(pid),
            message:"Product not found",
            code:EErrors.DATABASE_ERROR
        })
    }
    }

    async deleteOne(pid){
        try{
            const deletedProduct = await productsModel.deleteOne({_id:pid});
            return deletedProduct;
        } catch (error){
            CustomError.createError({
                name:"Failed deleting the product",
                cause:generatePidErrorInfo(pid),
                message:"Product not found",
                code:EErrors.DATABASE_ERROR
            })
        }
    }

    async getMockingProducts(limit){
        let mockingProducts = [];
        
        for(let i=0;i<limit;i++){
            try {
                
                mockingProducts.push(generateProduct());
            } catch (error) {
                req.logger.error("Error generating product:", error);
            }
        }
        return mockingProducts;
    }

}