import { productsModel } from "../models/product.model.js";
import CustomError from "../services/customErrors.js";
import EErrors from "../services/enums.js";
import { generatePidErrorInfo } from "../services/info.js";
import env from "../config-middlewares/environment.js";
import { transport } from "../utils.js";

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

    async create(productData){
        const productos = await productsModel.create(productData);
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

    async editOneByOwner(pid, updatedProductData, owner) {
        try{
            let foundProduct = await productsModel.find({_id:pid});
            if(foundProduct[0].owner == owner){
                let updatedProduct = await productsModel.updateOne({_id:pid}, updatedProductData);
                return updatedProduct;
            } else return "Failed to update the product, you are not the owner of this product";
            

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

    async deleteOneByOwner(pid,owner){
        try{
            let foundProduct = await productsModel.find({_id:pid});
            if(foundProduct[0].owner == owner){
                    await transport.sendMail({
                        from:`Rebecca Orona <${env.email_user}>`,
                        to:owner,
                        subject:'Su producto fue eliminado',
                        html:`
                        <p style="color: black;">Nos comunicamos con usted para avisarle que su producto
                        llamado ${foundProduct[0].title} acaba de ser eliminado</p>

                        <p style="color: black;">Si piensa que esto puede haber sido un error por favor comuniquese con nosotros</p>

                        <p style="color: black;">Comercio Blahaj</p>
                        `,
                        attachments:[]
                    })
                const deletedProduct = await productsModel.deleteOne({_id:pid});
                return deletedProduct;
            } else return "Failed to delete the product, you are not the owner of this product";
        } catch (error){
            CustomError.createError({
                name:"Failed deleting the product",
                cause:generatePidErrorInfo(pid),
                message:"Product not found",
                code:EErrors.DATABASE_ERROR
            })
        }
    }

}