import { Router } from 'express';
import { passportCall } from '../utils.js';
import {  register,failRegister,login,failLogin,logout,githubcallback,github,currentUser,resetPassword, sendEmail, roleChange } from '../controllers/users.controller.js';



const userRouter = Router();


userRouter.post('/register', register);

userRouter.get('/failRegister', failRegister);

userRouter.post('/login', login);

userRouter.get('/failLogin', failLogin);
    
userRouter.get('/github', github);

userRouter.get('/githubcallback', githubcallback);

userRouter.get('/currentUser', passportCall('jwt'), currentUser);

userRouter.post('/sendResetPassEmail', sendEmail);

userRouter.put('/resetPassword', resetPassword);

userRouter.get('/logout', logout);

userRouter.put('/premium/:uid', roleChange)



export default userRouter;