import { Router } from 'express';
import userModel from '../models/Users.model.js';



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

    sessionsRouter.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    const exists = await userModel.findOne({ email });
    if (exists) return res.status(400).send({ status: "error", error: "User already exists" });
    const user = {
        first_name,
        last_name,
        email,
        age,
        password //De momento no vamos a hashearlo, eso corresponde a la siguiente clase.
    }
    await userModel.create(user);
    
    res.status(200).send({ status: "success", message: "User registered" });
})

sessionsRouter.post('/login', async (req, res) => {
    
    const { email, password } = req.body;

    let role = 'usuario';
    
    if (email === 'adminCoder@coder.com' && password === 'adminCod3r123') {
        role = 'admin';
        req.session.user = {
            email: email,
            role: role
        }
        
    } else {
    
    
    
    // check if user exists
    const user = await userModel.findOne({ email });
    console.log(user)

    if (!user) return res.status(400).send({ status: "error", error: "User does not exists" });

    // check if password is correct

    if (user.password !== password) {
        return res.status(400).send({ status: "error", error: "User exists but password is incorrect" });
    }

    req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age: user.age,
        role: role
    }
}
    res.send({ status: "success", payload: req.session.user, message: "¡Logueo realizado! :)" });
});

sessionsRouter.get('/userData', (req, res) => {
    res.send(req.session.user);
})

sessionsRouter.get('/logout', (req, res) => {
    req.session.destroy( err => {
        if(!err)
            res.status(200).send({ status: 'success', message: 'Logout successful' });
        else res.send({status: 'Logout error!', body: err});
    })
});


export default sessionsRouter;