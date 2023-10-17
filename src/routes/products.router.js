import express from 'express';
import { getAllProducts, getProductById, createOne, createMany, editOne, deleteOne, getProductsPage } from '../controllers/products.controller.js';
import { passportCall } from '../utils.js';

const productsRouter = express.Router();

productsRouter.get('/get', passportCall('jwt'), getAllProducts)

productsRouter.get('', passportCall('jwt'), getProductsPage);

productsRouter.get('/:pid', passportCall('jwt'), getProductById);

productsRouter.post('/createOne', passportCall('jwt'), createOne);

productsRouter.post('/createMany', passportCall('jwt'), createMany);

productsRouter.put('/:pid', passportCall('jwt'), editOne);

productsRouter.delete('/:pid', passportCall('jwt'), deleteOne);

export default productsRouter;
