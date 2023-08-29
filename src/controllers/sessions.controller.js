import { SessionsService } from "../services/sessions.service.js";
import passport from "passport";
import { authorization, passportCall, createHash } from "../utils.js";
const sessionsService = new SessionsService();


export const register =  (req, res) => {
    passport.authenticate('register', { failureRedirect: '/api/sessions/failRegister' })(req, res, () => {
        res.send({ status: "success", message: "User registered!" });
    });
};


export const failRegister = async(req,res)=>{
    console.log("Failed register");
    res.status(400).send({ status: "error", error: "Failed register" });
}

export const login =  async (req, res) => {
    passport.authenticate('login', {failureRedirect:'/api/sessions/failLogin', session: false})(req, res, () => {
        if(!req.user) return res.status(400).send({status:"error",error:"Invalid credentials"});
    req.user = {
        name: `${req.user.first_name} ${req.user.last_name}`,
        age: req.user.age,
        email: req.user.email,
        role: req.user.role
    }


    res.send({status:"success",payload:req.user})
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
            // Handle authentication error
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
            // Handle error
            res.redirect('/login');
        }
    })(req, res); // Pass the outer req and res to the authenticate middleware
};

export const currentUser = (req, res) => { authorization("usuario")(req,res, () =>{
    req.user = {
        name: `${req.user.user.first_name} ${req.user.user.last_name}`,
        age: req.user.user.age,
        email: req.user.user.email,
        role: req.user.user.role,
    };

    res.send({ status: "success", payload: req.user });
})
}


export const restartPassword = async(req,res) =>{

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).send({
            status: "error",
            error: "Incomplete Values",
        });
    }
    
    const user = await sessionsService.findOne(email);
    
    if (!user) return res.status(404).send({ status: "error", error: "Not user found" });
    
    const newHashedPassword = createHash(password);
    
    await sessionsService.updateOne(user._id, newHashedPassword);
    
    res.send({ status: "success", payload:"Reset successful" })

}




