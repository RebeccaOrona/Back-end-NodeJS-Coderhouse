import ProductsDao from "../daos/products.dao.js";
export default class productRepository{
    constructor(){
        this.dao = new ProductsDao();
    }


    getAll = async() => {
        let result = await this.dao.getAll();
        return result
    }

    getAllPage = async(querysearch,queryvalue,limit,page,sort) => {
        
        let result = await this.dao.getAllPage(querysearch,queryvalue,limit,page,sort);
        return result;
    }

    getProductById = async(pid) => {
        return await this.dao.getById(pid);
    }

    create = async(product) => {
        return await this.dao.create(product);
    }

    editOne = async(pid, updatedProductData) => {
        return await this.dao.editOne(pid, updatedProductData);
    }

    editOneByOwner = async(pid, updatedProductData, owner) =>{
        return await this.dao.editOneByOwner(pid, updatedProductData, owner);
    }

    deleteOne = async(pid) => {
        return await this.dao.deleteOne(pid);
    }

    deleteOneByOwner = async(pid, owner) =>{
        return await this.dao.deleteOneByOwner(pid, owner);
    }

}