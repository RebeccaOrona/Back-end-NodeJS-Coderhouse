import { Router } from 'express';
import productsRouter from './products.router.js';
import env from '../config/enviroment.js';
import cookieParser from 'cookie-parser';
import express from 'express';
import axios from 'axios';



const router = Router();
const app = express();
app.use(cookieParser());
const api = axios.create({
  baseURL: env.baseUrl,
});

router.get('/register', (req, res) => {
    res.render('register');
})
router.get('/resetPassword',(req,res)=>{
  res.render('reset-password');
})
router.get('/', (req, res) => {
    res.render('login');
})

router.get('/profile', async(req, res) => {
  res.render('profile')
});

router.get('/logout', (req, res) => {
  res.render('logout');
})


router.use('/products', productsRouter);
  

  // Ruta para la vista "realTimeProducts.handlebars" (lista de productos en tiempo real)
router.get('/realtimeproducts', async (req, res) => {
    try {
      const products = await getAllProducts();
      res.render('realTimeProducts', { products });
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener los productos' });
    }
  });

export default router;