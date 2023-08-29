import { ProductsService } from "../services/products.service.js";

const productsService = new ProductsService();

export const getAllProducts = async(req, res) => {
    try{
        let products = await productsService.getAll()
        res.send({result:"success",payload:products});
    }
    catch(error){
        console.log("Cannot get products with mongoose: "+error)
    }
};

export const getProductsPage = async(req,res)=>{
    let { page } = req.query
  let { limit } = req.query
  let { sort } = req.query
  let { querysearch } = req.query
  let { queryvalue} = req.query
  let searchQuery = {};
  if (querysearch && queryvalue) {
    searchQuery[querysearch] = queryvalue;
  }
  let products = await productsService.getAllPage(searchQuery,limit,page,sort);
  res.render('products', { products })
}

export const getProductById = async(req,res)=>{
    try {
        const {pid} = req.params
        const product = await productsService.getProductById(pid)
        if (product) {
            res.render('product-details', product.toJSON());
        } else {
            res.status(404).json({ error: 'Product not found' });
        }
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch product' });
    }
}

export const createOne = async(req,res)=>{
    try {
        const newProduct = req.body;
        const product = await productsService.create(newProduct);
        res.send({ status: "success", payload: product });
    } catch (error) {
    res.send({ status: "error", error: 'Failed to create product' });
  }
}

  export const createMany = async(req,res)=>{
    let products = req.body; // Array of products

    if (!Array.isArray(products)) {
        return res.send({ status: "error", error: "Invalid data format" });
    }

    try {
        let result = await productsService.create(products);;
        res.send({ status: "success", payload: result });
      } catch (error) {
        res.send({ status: "error", error: error.message });
      }
      
  }

  export const editOne = async(req,res)=>{
    try {
    const {pid} = req.params;
    const updatedProductData = req.body;

    const updatedProduct = await productsService.editOne(pid, updatedProductData);
    if (updatedProduct) {
        res.send({ status: "success", payload: updatedProductData });
      } else {
        res.status(404).json({ error: 'Product not found' });
      }
    } catch (error) {
      res.status(500).json({ error: 'Failed to update product' });
    }
  }


export const deleteOne = async(req,res)=>{

  try {
    const {pid} = req.params;
    const deletedProduct = await productsService.deleteOne(pid);
    if (deletedProduct) {
      res.json(deletedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
}


