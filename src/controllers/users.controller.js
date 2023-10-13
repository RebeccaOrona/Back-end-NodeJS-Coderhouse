import { UserService } from "../repositories/index.js";
import passport from "passport";
import { createHash } from "../utils.js";
import UserDTO from "../daos/DTOs/user.dto.js";
import { isValidPassword } from "../utils.js";
import jwt from 'jsonwebtoken'
import env from '../config-middlewares/environment.js';

export const register =  (req, res) => {
    passport.authenticate('register', { failureRedirect: '/api/users/failRegister' })(req, res, () => {
        res.send({ status: "success", message: "User registered!" });
    });
};


export const failRegister = async(req,res)=>{
    req.logger.error("Failed register");
    res.status(400).send({ status: "error", error: "Failed register" });
}

export const login =  async (req, res) => {
    passport.authenticate('login', {failureRedirect:'/api/users/failLogin', session: false})(req, res, async () => {
        if (!req.user) {
            res.status(400).send({ status: "error", error: "Invalid credentials" });
          } else {
            req.user = {
              name: `${req.user.first_name} ${req.user.last_name}`,
              age: req.user.age,
              email: req.user.email,
              role: req.user.role
            };
      
            res.send({ status: "success", payload: req.user });
          }
});
}

export const failLogin = (req,res) => {
    req.logger.error("Failed login");
    res.status(403).send({ status: "error", error: "Failed login" });
}

export const logout = async(req,res)=>{
    res.status(200).send({ status: 'success', message: 'Logout successful' });
}

export const github = passport.authenticate('github', { scope: ['user:email'] });

export const githubcallback = (req, res) => {
    passport.authenticate('github', { failureRedirect: '/' }, (authError, user) => {
        if (authError) {
            // Manejar el error de authentication
            return res.redirect('/');
        }

        try {
            req.user = {
                name: `${user.first_name}${user.last_name}`,
                age: user.age,
                email: user.email,
                role: user.role,
            };

            res.redirect('/products');
        } catch (error) {
            // Manejar el error
            res.redirect('/');
        }
    })(req, res); // Pasar el req y el res al middleware authenticate
};

export const currentUser = async(req, res) => {
    let user = new UserDTO({
        name: `${req.user.user.first_name} ${req.user.user.last_name}`,
        age: req.user.user.age,
        email: req.user.user.email,
        role: req.user.user.role
    })

    res.send({ status: "success", payload: user });
};

export const sendEmail = async(req,res) => {
    const email = req.body;
    console.log(email.email);

    if (!email) {
        req.logger.error("Failed to send email, the email value is incomplete")
        return res.status(400).send({
            status: "error",
            error: "Incomplete value",
        });
    }

    let result = await UserService.sendEmail(email.email)
    console.log(result)
    if(result) {
        res.send({ status: "success", payload:"Email sent successfully" })
    }

}

export const resetPassword = async(req,res) =>{

    const { password, passwordrep } = req.body;
    const token = req.header('Authorization');
    if (!token || !password || !passwordrep) {
        req.logger.error("Failed to reset password, values are incomplete")
        return res.status(400).send({
            status: "error",
            error: "Incomplete Values",
        });
    }
    const decodedToken = jwt.verify(token.replace('Bearer ', ''), env.PRIVATE_KEY);
    const email = decodedToken.email; // Access the user's email from the decoded token
    const user = await UserService.findOne({ email: email });
    
    if (!user) {
        req.logger.error("User not found")
        return res.status(404).send({ status: "error", error: "User not found" });
    }
    

    if (isValidPassword(user, password)) {
        req.logger.error("Failed to reset password, the new password can't be the same as the old one")
        return res.status(400).send({
            status: "error",
            error: "New password can't be the same as the old one",
        });
    }
    
    
    const newHashedPassword = createHash(password);
    
    await UserService.updateOne(user._id, newHashedPassword);
    
    res.send({ status: "success", payload:"Reset successful" })

}

export const roleChange = async (req, res) => {
    try{
      let {uid} = req.query;
      let result =  await UserService.roleChange(uid);
      res.send({ status: "success", payload: result });
    } catch(error) {
      req.logger.error(error);
      res.status(500).send({ status: "error", message: "Internal server error" });
    }
  }



