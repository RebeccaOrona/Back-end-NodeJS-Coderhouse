import CartsDao from "../daos/carts.dao.js";


export class CartsService {

    constructor(){
        this.dao = new CartsDao();
    }


    createCart(cartData) {
        return this.dao.createCart(cartData);
    }

    getId(cid){
        return this.dao.getId(cid);
    }


}