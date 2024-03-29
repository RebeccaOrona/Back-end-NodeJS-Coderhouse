import { ProductsService } from "../repositories/index.js";
import { authorization } from "../config-middlewares/authorization.js";

export const getAllProducts = (req, res) => { authorization("usuario")(req,res, async() =>{
  try{
      let products = await ProductsService.getAll()
      res.send({result:"success",payload:products});
  }
  catch(error){
    req.logger.error("Cannot get products with mongoose: "+error)
  }
});
};

export const getProductsPage = async(req, res) => {
    let { page } = req.query
  let { limit } = req.query
  let { sort } = req.query
  let { querysearch } = req.query
  let { queryvalue} = req.query
  
  let products = await ProductsService.getAllPage(querysearch,queryvalue,limit,page,sort);
  res.render('products', { products })
};


export const getProductById = (req, res) => { authorization(["usuario","premium"])(req,res, async() =>{
  try{
    const {pid} = req.params
    const product = await ProductsService.getProductById(pid)
    if (product) {
        res.render('product-details', product.toJSON());
    } 
  }catch (error){
    req.logger.error(error);
    res.status(404).json({ error: 'Product not found' });
  }
});
};

export const createOne = (req, res) => { authorization(["admin","premium"])(req,res, async() =>{
  try{
    const newProduct = req.body;
    console.log(newProduct)
    let owner = req.user.user.email;
    console.log(owner)
    if(req.user.user.role == "admin"){
      owner = 'admin';
    }
    newProduct.owner = owner;
    const product = await ProductsService.create(newProduct);
    res.send({ status: "success", payload: product });
  }catch (error){
    res.send({ status: "error", message: "No se logro crear el producto"})
    req.logger.error(error);
  }
})
};

  export const createMany = (req, res) => { authorization(["admin","premium"])(req,res, async() =>{
    let products = req.body; 
    let owner = req.user.user.email;
    console.log(owner)
    if (!Array.isArray(products)) {
      req.logger.error("Data format incorrect, array expected")
      return res.send({ status: "error", error: "Data format incorrect" });
    }
    for (const product of products) {
      if(typeof product.title !== 'string' ||
        typeof product.description !== 'string' ||
        typeof product.code  !== 'string' ||
        typeof product.price !== 'number' ||
        typeof product.status  !== 'boolean' ||
        typeof product.stock !== 'number' ||
        typeof product.category !== 'string') {
          req.logger.error("Failed creating the products, received parameters are not valid");
          return res.status(400).send({ status: "error", error: "Invalid data format" });
        }
      }

    try {
        let result = await ProductsService.create(owner,products);;
        res.send({ status: "success", payload: result });
      } catch (error) {
        req.logger.error(error);
        res.send({ status: "error", error: error.message });
      }
      
  });
};

  export const editOne = (req, res) => { authorization(["admin","premium"])(req,res, async() =>{
    try{
      const {pid} = req.params;
      const updatedProductData = req.body;
      console.log(updatedProductData)
      if(typeof updatedProductData.title !== 'string' ||
        typeof updatedProductData.description !== 'string' ||
        typeof updatedProductData.code  !== 'string' ||
        typeof updatedProductData.price !== 'number' ||
        typeof updatedProductData.status  !== 'boolean' ||
        typeof updatedProductData.stock !== 'number' ||
        typeof updatedProductData.category !== 'string') {
          req.logger.error("Failed updating the product, received parameters are not valid");
          res.status(404).json({error: "Invalid parameters data type" });
      } else {
        if(req.user.user.role=='premium'){
          let owner = req.user.user.email
          let result = await ProductsService.editOneByOwner(pid, updatedProductData, owner);
          res.send({ status: "success", payload: result, updatedProductData })
        } else {
        await ProductsService.editOne(pid, updatedProductData);
        res.send({ status: "success", payload: updatedProductData });
        }
      }
      } catch (error){
        res.status(404).json({ error: 'Product not found' });
        req.logger.error(error)
      }
  });
};


export const deleteOne =  (req, res) => { authorization(["admin","premium"])(req,res, async() =>{
  try{
    const {pid} = req.params;
    let role = req.user.user.role
    if(role=='premium'){
      let owner = req.user.user.email
      let result = await ProductsService.deleteOneByOwner(pid,owner);
      res.send({payload: result})
    } else {
    const deletedProduct = await ProductsService.deleteOne(pid);
    res.json(deletedProduct);
    }
  } catch (error){
      res.status(404).json({ error: 'Product not found' });
      req.logger.error(error)
  }
});
};





