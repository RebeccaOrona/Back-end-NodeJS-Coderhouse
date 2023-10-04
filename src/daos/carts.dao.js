import { cartsModel } from "../models/cart.model.js";
import { TicketService, ProductsService } from "../repositories/index.js";
import TicketDTO from "../daos/DTOs/ticket.dto.js";
import moment from "moment-timezone";
import CustomError from "../services/customErrors.js";
import EErrors from "../services/enums.js";
import { generateCidErrorInfo, generatePurchaserErrorInfo } from "../services/info.js";

export default class CartsDao { 

    async createCart(cartData) {
        const result = await cartsModel.create(cartData);
        return result;
    }

    async addProduct(cid, pid){
        try{
        let cart = await cartsModel.findById(cid);
        console.log(cart)
        let products = cart.products;
        for (const product of cart.products) {
            console.log("Product inside cart: " +product.product)
        }
        
        const productIndex = products.findIndex((product) => product.product == pid);
        if (productIndex !== -1) {
        // Product already exists in the cart, increment its quantity by 1
        products[productIndex].quantity += 1;
        } else {
        // Product does not exist in the cart, add it with quantity 1
        products.push({
            product: pid,
            quantity: 1
        });
        }
        return await cart.save();
    } catch {
        CustomError.createError({
            name:"Error agregando el producto al carrito",
            cause:generateCidErrorInfo(cid),
            message:"El carrito no fue encontrado",
            code:EErrors.DATABASE_ERROR
        })
    }
    }

    async removeFromCart(cid,pid){
        try{
            let cart = await cartsModel.findById(cid)
            let productIndex = cart.products.findIndex(product => product.product._id == pid);

            if (productIndex !== -1 && cart.products[productIndex].quantity > 1) {
                cart.products[productIndex].quantity -= 1;
                return({message: "Product subtracted from cart", payload:await cart.save()});
            } else if(productIndex !== -1 && cart.products[productIndex].quantity == 1){
                // Remove the product from the products array
                cart.products.splice(productIndex, 1);
        
            
                return({message: "Product deleted from cart", payload:await cart.save()});
                
            } else {
            return("Product not found in cart");
            }
        } catch {
            CustomError.createError({
                name:"Error eliminando el producto del carrito",
                cause:generateCidErrorInfo(cid),
                message:"El carrito no fue encontrado",
                code:EErrors.DATABASE_ERROR
            })
        }
    }

    async editCart(cid){
        try{
            let cart = await cartsModel.findById(cid);
            let products = req.body;
            cart.products = products;
            await cart.save();
            return('Cart updated successfully');
        } catch {
            CustomError.createError({
                name:"Error editando el carrito",
                cause:generateCidErrorInfo(cid),
                message:"El carrito no fue encontrado",
                code:EErrors.DATABASE_ERROR
            })
        }
    }

    async getCart(cid){
        try{
            const cart = await cartsModel.findById(cid).populate('products.product');
            return cart;
        } catch {
            CustomError.createError({
                name:"Error mostrando el carrito",
                cause:generateCidErrorInfo(cid),
                message:"El carrito no fue encontrado",
                code:EErrors.DATABASE_ERROR
            })
        }
    }

    async findCartByPurchaser(purchaser){
            const cart = await cartsModel.find(purchaser);
            if (cart.length === 0) {
                CustomError.createError({
                    name:"Error encontrando el carrito segun el comprador",
                    cause:generatePurchaserErrorInfo(purchaser),
                    message:"El carrito no fue encontrado",
                    code:EErrors.DATABASE_ERROR
                })
            }
            return cart
    }

    async editProductInCart(cid,pid,quantity){
        try{
            const cart = await cartsModel.findById(cid);
            const productIndex = cart.products.findIndex(product => product.product == pid);
            if (productIndex === -1) return ('Product not found in cart');
            
            cart.products[productIndex].quantity = quantity;
            return ({message:'Product quantity updated in cart', payload:await cart.save()})
        } catch {
            CustomError.createError({
                name:"Error editando el producto del carrito",
                cause:generateCidErrorInfo(cid),
                message:"El carrito no fue encontrado",
                code:EErrors.DATABASE_ERROR
            })
        }
    }

    async deleteAllProducts(cid){
        try{
            let cart = await cartsModel.findById(cid);
            cart.products = [];
            await cart.save();
            return ({ message:'All products deleted from the cart', payload: cart})
        } catch {
            CustomError.createError({
                name:"Error eliminando los productos del carrito",
                cause:generateCidErrorInfo(cid),
                message:"El carrito no fue encontrado",
                code:EErrors.DATABASE_ERROR
            })
        }
    }
   
    async purchaseCart(cid){
        try{
            let cart = await cartsModel.findById(cid);
            let canPurchase = true;
            const productsToRemove = []; // Create a list of products to remove

            for (const cartItem of cart.products) {
                const productDocument = await ProductsService.getProductById(cartItem.product);

                if (!productDocument) {
                    console.log(`Product not found for ID: ${cartItem.product}`);
                    continue; // Skip to the next product in the cart
                }

                const productStock = productDocument.stock;

                console.log(`Product Stock for ${productDocument.title}: ${productStock}`);

                if (cartItem.quantity > productStock) {
                canPurchase = false;
                } else {
                if (cartItem.quantity <= productStock) {
                    // Update the product's stock in the database
                    productDocument.stock -= cartItem.quantity;
                    await productDocument.save();
                    // Add the product to the removal list
                    productsToRemove.push(cartItem);
                }
                }
            }
            
            for (const productToRemove of productsToRemove) {
                const productIndex = cart.products.findIndex(item => item.product.equals(productToRemove.product));


                if (productIndex !== -1) {
                cart.products.splice(productIndex, 1);
                }
                const productDocument = await ProductsService.getProductById(productToRemove.product);
                const currentUTCTime = moment().tz('America/Argentina/Buenos_Aires');
                const formattedDate = currentUTCTime.format('DD-MM-YYYY, HH:mm:ss');
                let newTicket = new TicketDTO({
                code: productDocument.code,
                amount: productToRemove.quantity,
                purchase_datetime: formattedDate,
                purchaser: cart.purchaser
                })
                TicketService.createTicket(newTicket)
            }

            // Save the updated cart
            await cart.save();
            
            
            if (!canPurchase) {
                return ({status:400 ,message: 'Not enough stock to purchase the cart', payload:cart });
            }
            return ({status:200 ,message: 'Cart can be purchased'})
        } catch {
            CustomError.createError({
                name:"Error comprando el carrito",
                cause:generateCidErrorInfo(cid),
                message:"El carrito no fue encontrado",
                code:EErrors.DATABASE_ERROR
            })
        }
    }
}