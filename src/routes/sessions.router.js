import { Router } from 'express';
import userModel from '../models/Users.model.js';
import { authToken, authorization, createHash,isValidPassword, passportCall } from '../utils.js';
import passport from 'passport';



const sessionsRouter = Router();


sessionsRouter.get('/session', (req, res) => {
        if (!req.session.count) {
            req.session.count = 1;
            res.send('Bienvenido a la pagina');
            return;
        }
    
        req.session.count++;
        res.send(`Usted ha visitado la pagina ${req.session.count} veces`);
    });

sessionsRouter.post('/register', passport.authenticate('register', {failureRedirect:'/api/sessions/failRegister'}), async (req, res) => {
    res.send({status:"success", message:"User registered!"})
})

sessionsRouter.get('/failRegister', async(req,res)=>{
    console.log("Failed register");
    res.status(400).send({ status: "error", error: "Failed register" });
})

sessionsRouter.post('/login', passport.authenticate('login', {failureRedirect:'/api/sessions/failLogin', session: false}), async (req, res) => {
    if(!req.user) return res.status(400).send({status:"error",error:"Invalid credentials"});
    req.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    }
    console.log(req.user);
    console.log("success");

    res.send({status:"success",payload:req.user})
})


sessionsRouter.get('/failLogin', (req,res) => {
    console.log("Failed login");
    res.status(403).send({ status: "error", error: "Failed login" });
})
    
sessionsRouter.get('/github', passport.authenticate('github',{scope:['user:email']}), async(req,res) => {})
sessionsRouter.get('/githubcallback', passport.authenticate('github',{failureRedirect:'/login'}), async(req,res) =>{
    req.user = {
    name: `${req.user.first_name}${req.user.last_name}`,
    age: req.user.age,
    email: req.user.email,
    role: req.user.role
    }
    console.log(req.user);
    res.redirect('/products');
})

sessionsRouter.get('/current', passport.authenticate('jwt', { session: false }), (req,res) =>{
    res.send({status:"success", payload:req.user});
})

sessionsRouter.get('/currentUser', passportCall('jwt'), authorization("usuario"), (req,res) =>{
    req.user = {
        name: `${req.user.user.first_name} ${req.user.user.last_name}`,
        age: req.user.user.age,
        email: req.user.user.email,
        role: req.user.user.role
    }
    console.log(req.user);
    res.send({status:"success", payload:req.user});
})

sessionsRouter.get('/userData', (req, res) => {
    res.send(req.user);
})

sessionsRouter.put('/restartPassword', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({
            status: "error",
            error: "Incomplete Values",
        });
    }
    
    const user = await userModel.findOne({ email });
    
    if (!user) return res.status(404).send({ status: "error", error: "Not user found" });
    
    const newHashedPassword = createHash(password);
    
    await userModel.updateOne({ _id: user._id }, { $set: { password: newHashedPassword } });
    
    res.send({ status: "success", payload:"Reset successful" })
})

sessionsRouter.get('/logout', (req, res) => {
    // req.session.destroy( err => {
    //     if(!err)
            res.status(200).send({ status: 'success', message: 'Logout successful' });
    //     else res.send({status: 'Logout error!', body: err});
    // })
});


export default sessionsRouter;