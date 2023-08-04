
import express from 'express';
import { productsModel } from '../models/product.model.js';

const productsRouter = express.Router();

productsRouter.get('/get', async (req,res)=>{
    try{
        let products = await productsModel.find()
        res.send({result:"success",payload:products})
    }
    catch(error){
        console.log("Cannot get products with mongoose: "+error)
    }
})

productsRouter.get('', async(req,res)=>{
  let { page } = req.query
  let { limit } = req.query
  let { sort } = req.query
  let { querysearch } = req.query
  let { queryvalue} = req.query
  let searchQuery = {};
  if (querysearch && queryvalue) {
    searchQuery[querysearch] = queryvalue;
  }
  let products = await productsModel.paginate( searchQuery ,{
      limit:limit ?? 10,
      page: page ?? 1,  
      sort: { price: sort ?? "desc" }
  });
  console.log(products);
  res.render('products', { products })
});

productsRouter.get('/:pid', async (req, res) => {
  try {
    const {pid} = req.params
    const product = await productsModel.findById(pid);
    if (product) {
      res.render('product-details', product.toJSON());
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

productsRouter.post('/createOne', async (req, res) => {
  try {
    const newProduct = req.body;
    const product = await productsModel.create(newProduct);
    res.send({ status: "success", payload: product });
  } catch (error) {
    res.send({ status: "error", error: 'Failed to create product' });
  }
});

productsRouter.post('/createMany', async(req,res) =>{
  let products = req.body; // Array of products

if (!Array.isArray(products)) {
  return res.send({ status: "error", error: "Invalid data format" });
}

try {
  let result = await productsModel.create(products);
  res.send({ status: "success", payload: result });
} catch (error) {
  res.send({ status: "error", error: error.message });
}
})

productsRouter.put('/:pid', async (req, res) => {
  try {
    const {pid} = req.params;
    const updatedProductData = req.body;

    const updatedProduct = await productsModel.updateOne({_id:pid}, updatedProductData)
    if (updatedProduct) {
      res.send({ status: "success", payload: updatedProductData });
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

productsRouter.delete('/:pid', async (req, res) => {
  try {
    const {uid} = req.params;
    const deletedProduct = await productsModel.deleteOne({_id:uid})
    if (deletedProduct) {
      res.json(deletedProduct);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default productsRouter;
