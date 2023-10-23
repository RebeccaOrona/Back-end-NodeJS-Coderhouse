import { Router } from 'express';
import productsRouter from './products.router.js';



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

router.get('/login', (req, res) => {
    res.render('login');
})

router.get('/profile', (req, res) => {
  res.render('profile')
});

router.get('/logout', (req, res) => {
  res.render('logout');
})

router.get('/users', (req, res) => {
  res.render('users');
})

router.use('/products', productsRouter);
  


export default router;