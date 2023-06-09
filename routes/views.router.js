import express from 'express';

const router = express. Router();

router.get('/', (req,res)=>{
    res.render('index', {}); //De momento sólo renderizaremos la vista, no pasaremos objeto.
})

export default router;