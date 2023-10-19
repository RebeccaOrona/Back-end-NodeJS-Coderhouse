import { authorization } from "../config-middlewares/authorization.js";
import { CartsService } from "../repositories/index.js";

export const createCart = (req, res) => { authorization(["usuario","premium"])(req,res, async() =>{
  try {
    const userEmail = req.user.user.email;
    const cartData = {
      purchaser: userEmail,
    };
    let result = await CartsService.createCart(cartData);
    res.send({ status: "success", cartId: result._id, payload: result });
  } catch (error) {
    req.logger.error("Cart creation failed:", error);
    res.status(500).send({ status: "error", error: "Failed to create cart" });
  }

});
};


export const addToCart = (req, res) => { authorization(["usuario","premium"])(req,res, async() =>{
  try {
    let { cid, pid } = req.params;
    if(req.user.user.role == "premium"){
      let owner = req.user.user.email
      let cart = await CartsService.addProductToCartPremium(cid,pid,owner);
      res.send({payload: cart});
    } else {
      let cart = await CartsService.addProductToCart(cid,pid)
      res.send({ status: "success", payload: cart });
    }
  } catch (error) {
    res.status(500).send({ status: "error", error: 'Failed to add product to cart' });
    req.logger.error(error);
  }
});
};


export const getCart = async (req, res) => {

  try {
    let { cid } = req.params;
    let cart = await CartsService.getCart(cid);
    if (cart) {
      res.render('cart', { cart });
    } else {
      res.status(404).json({ error: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
    req.logger.error(error)
  }
}

export const findCartByPurchaser = async (req, res) => {
  try{
    let {purchaser} = req.params;
    let cart = await CartsService.findCartByPurchaser({purchaser:purchaser});
    res.status(200).send({cart})
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch cart' });
    req.logger.error(error);
  }

}

export const removeFromCart = (req, res) => { authorization("usuario")(req,res, async() =>{
  let { cid, pid } = req.params
  try {
      res.send(await CartsService.removeFromCart(cid,pid));
  } catch (error) {
    res.status(500).send({ status: "error", message: "Failed to delete product from cart" });
    req.logger.error(error)
  }
});
};

export const editCart = (req, res) => { authorization("admin")(req,res, async() =>{
  try {
    let { cid } = req.params;
    let products = req.body;
    res.send(await CartsService.editCart(cid,products));
  } catch (error) {
    res.status(500).send({ status: "error", message: "Failed to update cart" });
    req.logger.error(error);
  }
});
};


export const editProductInCart = (req, res) => { authorization("usuario")(req,res, async() =>{
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    res.send(await CartsService.editProductInCart( cid, pid, quantity));
  } catch (error) {
    res.status(500).send({ status: 'error', message: 'Failed to update product quantity in cart' });
    req.logger.error(error);
  }
});
};

export const deleteAllProducts = async (req, res) => {
  try {
    let { cid } = req.params;
    res.send(await CartsService.deleteAllProducts(cid));
  } catch (error) {
    res.send({ status: 'error', message:'Failed to delete all products from the cart'});
    req.logger.error(error);
  }
}

export const purchaseCart = async (req,res) => {
  try {
  let { cid } = req.params;
  let result = await CartsService.purchaseCart(cid)

  res.send({status: result.status, payload: result});

  } catch (error) {
    res.status(500).json({ message: 'Cart not found' });
    req.logger.error(error);
  }
}

