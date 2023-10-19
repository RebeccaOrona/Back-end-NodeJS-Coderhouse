import { Router } from 'express';
import productsRouter from './products.router.js';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUIExpress from 'swagger-ui-express';


const router = Router();

router.get('/register', (req, res) => {
    res.render('register');
})
router.get('/resetPassword',(req,res)=>{
  res.render('reset-password');
})
router.get('/resetPasswordEmail',(req,res)=>{
  res.render('reset-password-email');
})

router.get('/tokenExpired', (req,res) =>{
  res.render('token-expired')
})

router.get('/', (req, res) => {
    res.render('login');
})

router.get('/profile', (req, res) => {
  res.render('profile')
});

router.get('/logout', (req, res) => {
  res.render('logout');
})

router.use('/products', productsRouter);
  
// // Swagger config
// const swaggerOptions = {
//   definition: {
//       openapi: '3.0.1',
//       info: {
//           title: 'Documentacion API Ecommerce',
//           description: 'Documentacion para uso de swagger!!'
//       }
//   },
//   apis: [`./src/docs/**/*.yaml`]
// }

// // Creation of specs
// const specs = swaggerJSDoc(swaggerOptions);
// // Declaring of swagger API - endpoint
// router.use('/apidocs', swaggerUIExpress.serve, swaggerUIExpress.setup(specs));

export default router;