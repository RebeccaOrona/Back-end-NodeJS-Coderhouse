import { authorization } from "../utils.js";
import { ProductsService } from "../repositories/index.js";
import CustomError from "../services/customErrors.js";
import EErrors from "../services/enums.js";
import { generateUpdateErrorInfo, generateCreateErrorInfo, generatePidErrorInfo } from "../services/info.js";

export const getAllProducts = (req, res) => { authorization("usuario")(req,res, async() =>{
  try{
      let products = await ProductsService.getAll()
      res.send({result:"success",payload:products});
  }
  catch(error){
      console.log("Cannot get products with mongoose: "+error)
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


export const getProductById = (req, res) => { authorization("usuario")(req,res, async() =>{
      const {pid} = req.params
      const product = await ProductsService.getProductById(pid)
      if (product) {
          res.render('product-details', product.toJSON());
      } else {
          res.status(404).json({ error: 'Product not found' });
      }
});
};

export const createOne = (req, res) => { authorization("admin")(req,res, async() =>{
  try{
        const newProduct = req.body;
        const product = await ProductsService.create(newProduct);
        res.send({ status: "success", payload: product });
      }catch (error){
        res.send({ status: "error", message: "No se logro crear el producto"})
        console.log(error);
      }
})
};

  export const createMany = (req, res) => { authorization("admin")(req,res, async() =>{
    let products = req.body; // Array of products
    console.log(products)
    if (!Array.isArray(products)) {
        return res.send({ status: "error", error: "Formato de los datos incorrecto" });
    }
    for (const product of products) {
      if(typeof product.title !== 'string' ||
        typeof product.description !== 'string' ||
        typeof product.code  !== 'string' ||
        typeof product.price !== 'number' ||
        typeof product.status  !== 'boolean' ||
        typeof product.stock !== 'number' ||
        typeof product.category !== 'string') {
          CustomError.createError({
            name:"Error creando el/los producto/s",
            cause:generateCreateErrorInfo(product.title,product.description,product.code,
              product.price,product.status,product.stock,product.category),
            message:"Los parametros recibidos no son validos",
            code:EErrors.INVALID_TYPES_ERROR
          })
          return res.status(400).send({ status: "error", error: "Invalid data format" });
        }
      }

    try {
        let result = await ProductsService.create(products);;
        res.send({ status: "success", payload: result });
      } catch (error) {
        res.send({ status: "error", error: error.message });
      }
      
  });
};

  export const editOne = (req, res) => { authorization("admin")(req,res, async() =>{
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
          CustomError.createError({
            name:"Error editando el producto",
            cause:generateUpdateErrorInfo(updatedProductData.title,updatedProductData.description,updatedProductData.code,
              updatedProductData.price,updatedProductData.status,updatedProductData.stock,updatedProductData.category),
            message:"Los parametros recibidos no son validos",
            code:EErrors.INVALID_TYPES_ERROR
          })
        }
      const updatedProduct = await ProductsService.editOne(pid, updatedProductData);
      res.send({ status: "success", payload: updatedProductData });
      } catch (error){
        res.status(404).json({ error: 'Product not found' });
        console.log(error)
      }
  });
};


export const deleteOne =  (req, res) => { authorization("admin")(req,res, async() =>{
  try{
    const {pid} = req.params;
    const deletedProduct = await ProductsService.deleteOne(pid);
    res.json(deletedProduct);
  } catch (error){
      res.status(404).json({ error: 'Product not found' });
      console.log(error)
  }
});
};

export const getMockingProducts = async (req, res) => {
  try {
    let { limit = 10 } = req.query;
    let mockingProducts = await ProductsService.getMockingProducts(limit);
    console.log(mockingProducts);
    res.send({ status: "success", payload: mockingProducts });
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "error", message: "Internal server error" });
  }
};


