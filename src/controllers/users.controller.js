import { UserService } from "../repositories/index.js";
import passport from "passport";
import { createHash } from "../utils.js";
import UserDTO from "../daos/DTOs/user.dto.js";
import CustomError from "../services/customErrors.js";
import { generatePasswordErrorInfo } from "../services/info.js";



export const register =  (req, res) => {
    passport.authenticate('register', { failureRedirect: '/api/users/failRegister' })(req, res, () => {
        res.send({ status: "success", message: "User registered!" });
    });
};


export const failRegister = async(req,res)=>{
    console.log("Failed register");
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
    console.log("Failed login");
    res.status(403).send({ status: "error", error: "Failed login" });
}

export const logout = async(req,res)=>{
    res.status(200).send({ status: 'success', message: 'Logout successful' });
}

export const github = passport.authenticate('github', { scope: ['user:email'] });

export const githubcallback = (req, res) => {
    passport.authenticate('github', { failureRedirect: '/login' }, (authError, user) => {
        if (authError) {
            // Manejar el error de authentication
            return res.redirect('/login');
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
            res.redirect('/login');
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


export const restartPassword = async(req,res) =>{

    const { email, password } = req.body;

    if (!email || !password) {
        CustomError.createError({
            name:"Error en la restauracion de la contraseña",
            cause:generatePasswordErrorInfo({email,password}),
            message:"Los datos estan incompletos",
            code:EErrors.INVALID_TYPES_ERROR
        })
        return res.status(400).send({
            status: "error",
            error: "Incomplete Values",
        });
    }
    
    const user = await UserService.findOne(email);
    
    if (!user) return res.status(404).send({ status: "error", error: "User not found" });
    
    const newHashedPassword = createHash(password);
    
    await UserService.updateOne(user._id, newHashedPassword);
    
    res.send({ status: "success", payload:"Reset successful" })

}




