import { authorization } from "../utils.js";
import { ProductsService } from "../repositories/index.js";

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
    try {
        const {pid} = req.params
        const product = await ProductsService.getProductById(pid)
        if (product) {
            res.render('product-details', product.toJSON());
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
});
};

export const createOne = (req, res) => { authorization("admin")(req,res, async() =>{
    try {
        const newProduct = req.body;
        const product = await ProductsService.create(newProduct);
        res.send({ status: "success", payload: product });
    } catch (error) {
    res.send({ status: "error", error: 'Failed to create product' });
  }
})
};

  export const createMany = (req, res) => { authorization("admin")(req,res, async() =>{
    let products = req.body; // Array of products

    if (!Array.isArray(products)) {
        return res.send({ status: "error", error: "Invalid data format" });
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
    try {
    const {pid} = req.params;
    const updatedProductData = req.body;

    const updatedProduct = await ProductsService.editOne(pid, updatedProductData);
    if (updatedProduct) {
        res.send({ status: "success", payload: updatedProductData });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  });
};


export const deleteOne =  (req, res) => { authorization("admin")(req,res, async() =>{
  try {
    const {pid} = req.params;
    const deletedProduct = await ProductsService.deleteOne(pid);
    if (deletedProduct) {
      res.json(deletedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});
};


