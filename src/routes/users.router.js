import { Router } from 'express';
import { passportCall } from '../config-middlewares/passportCall.js';
import {  getAllUsers,deleteInactiveUsers,register,failRegister,login,failLogin,logout,githubcallback,github,currentUser,resetPassword, sendEmail, roleChange, deleteUser } from '../controllers/users.controller.js';


const userRouter = Router();

userRouter.get('/', passportCall('jwt'), getAllUsers)

userRouter.delete('/', deleteInactiveUsers)

userRouter.post('/register', register);

userRouter.get('/failRegister', failRegister);

userRouter.post('/login', login);

userRouter.get('/failLogin', failLogin);
    
userRouter.get('/github', github);

userRouter.get('/githubcallback', githubcallback);

userRouter.get('/currentUser', passportCall('jwt'), currentUser);

userRouter.post('/sendResetPassEmail', sendEmail);

userRouter.put('/resetPassword', resetPassword);

userRouter.post('/logout', logout);

userRouter.post('/premium',passportCall('jwt'), roleChange)

userRouter.delete('/deleteUser',passportCall('jwt'), deleteUser)


export default userRouter;