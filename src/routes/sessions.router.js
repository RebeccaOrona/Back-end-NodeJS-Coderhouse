import { Router } from 'express';
import userModel from '../models/Users.model.js';
import { passportCall } from '../utils.js';
import {  register,failRegister,login,failLogin,logout,githubcallback,github,currentUser,restartPassword } from '../controllers/sessions.controller.js';



const sessionsRouter = Router();


sessionsRouter.post('/register', register)

sessionsRouter.get('/failRegister', failRegister)

sessionsRouter.post('/login', login)

sessionsRouter.get('/failLogin', failLogin);
    
sessionsRouter.get('/github', github);

sessionsRouter.get('/githubcallback', githubcallback);

sessionsRouter.get('/currentUser', passportCall('jwt'), currentUser)

sessionsRouter.put('/restartPassword', restartPassword)

sessionsRouter.get('/logout', logout)



export default sessionsRouter;