import { cartsModel } from "../models/cart.model.js";
import { TicketService, ProductsService } from "../repositories/index.js";
import TicketDTO from "../daos/DTOs/ticket.dto.js";
import moment from "moment-timezone";

export default class CartsDao { 

    async createCart(cartData) {
        const result = await cartsModel.create(cartData);
        return result;
    }

    async addProduct(cid, pid){
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
    }

    async removeFromCart(cid,pid){
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
    }

    async editCart(cid){
        
        let cart = await cartsModel.findById(cid);
        let products = req.body;
        cart.products = products;
        await cart.save();
        return('Cart updated successfully');
    }

    async getCart(cid){
        const cart = await cartsModel.findById(cid).populate('products.product');
        return cart;
    }

    async findCartByPurchaser(purchaser){
        const cart = await cartsModel.find(purchaser);
        return cart
    }

    async editProductInCart(cid,pid,quantity){
        const cart = await cartsModel.findById(cid);
        if (!cart) return ('Cart not found');
        

        const productIndex = cart.products.findIndex(product => product.product == pid);
        if (productIndex === -1) return ('Product not found in cart');
        
        cart.products[productIndex].quantity = quantity;
        
        return ({message:'Product quantity updated in cart', payload:await cart.save()})
    }

    async deleteAllProducts(cid){
        let cart = await cartsModel.findById(cid);
        cart.products = [];
        await cart.save();
        return ({ message:'All products deleted from the cart', payload: cart})
    }
   
    async purchaseCart(cid){
        let cart = await cartsModel.findById(cid);
        if (!cart) {
            return ('Cart not found');
        }

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
    }
}