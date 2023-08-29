import { Router } from 'express';
import productsRouter from './products.router.js';


const router = Router();

router.get('/register', (req, res) => {
    res.render('register');
})
router.get('/resetPassword',(req,res)=>{
  res.render('reset-password');
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
  

export default router;