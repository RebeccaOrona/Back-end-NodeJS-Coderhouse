import { cartsModel } from "../models/cart.model.js";

export default class  CartsDao { 

    async createCart(cartData) {
        const result = await cartsModel.create(cartData);
        return result;
    }

    async getId(cid){
        const cartId = await cartsModel.findById(cid);
        return cartId;
    }

    async getCart(cid){
        const cart = await cartsModel.findById(cid).populate('products.product');
        return cart;
    }

   
}