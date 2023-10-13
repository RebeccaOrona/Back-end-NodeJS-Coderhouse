import CartsDao from "../daos/carts.dao.js";
export default class cartRepository{
    constructor(){
        this.dao =  new CartsDao();
    }

    async createCart(cartData){
        return await this.dao.createCart(cartData);
    }

    async getCart(cid){
        return await this.dao.getCart(cid);
    }

    async findCartByPurchaser(purchaser){
        return await this.dao.findCartByPurchaser(purchaser);
    }
    
    async addProductToCart(cip,pid) {
        return await this.dao.addProduct(cip,pid);
    }

    async addProductToCartPremium(cip,pid,owner) {
        return await this.dao.addProductPremium(cip,pid,owner);
    }

    async removeFromCart(cid,pid) {
        return await this.dao.removeFromCart(cid,pid);
    }

    async editCart(cid){
        return await this.dao.editCart(cid);
    }

    async editProductInCart(cid,pid,quantity){
        return await this.dao.editProductInCart(cid,pid,quantity);
    }

    async deleteAllProducts(cid){
        return await this.dao.deleteAllProducts(cid);
    }
    async purchaseCart(cid){
        return await this.dao.purchaseCart(cid);
    }
}