import express from 'express';
import { getAllProducts, getProductById, createOne, createMany, editOne, deleteOne, getProductsPage } from '../controllers/products.controller.js';

const productsRouter = express.Router();

productsRouter.get('/get', getAllProducts)

productsRouter.get('', getProductsPage);

productsRouter.get('/:pid', getProductById);

productsRouter.post('/createOne', createOne);

productsRouter.post('/createMany', createMany)

productsRouter.put('/:pid', editOne);

productsRouter.delete('/:pid', deleteOne);

export default productsRouter;
