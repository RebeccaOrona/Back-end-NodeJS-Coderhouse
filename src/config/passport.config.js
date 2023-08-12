import passport from 'passport';
import local from 'passport-local';
import userModel from '../models/Users.model.js'; 
import { createHash,isValidPassword } from '../utils.js';
import GitHubStrategy from 'passport-github2'

const localStrategy = local.Strategy;
const initializePassport = () => {
    passport.use('register',new localStrategy(
        {passReqToCallback:true,usernameField:'email'}, async(req,username,password,done) => {
            const {first_name,last_name,email,age} = req.body;
            try{
                let user = await userModel.findOne({email:username});
                if(user){
                    console.log("User already exists");
                    return done(null,false);
                }
                const newUser = {
                    first_name,
                    last_name,
                    email,
                    age,
                    password: createHash(password)
                }
                let result = await userModel.create(newUser);
                return done(null,access_token);
            }catch(error){
                return done("Error al crear el usuario: "+error);
            }
 
        }))
    

    passport.use('login', new localStrategy({ usernameField: 'email' }, async (username, password, done) => {
        try {
            const user = await userModel.findOne({ email: username });
            if (!user) return done(null, false, { message: "User not found" });
            if (!isValidPassword(user, password)) return done(null, false);
            return done(null, user);
        } catch (error) {
            return done({ message: "Error logging in" });
        }
    }));

    passport.use('github',new GitHubStrategy({
        clientID:"Iv1.aa9f96cbd39f0d3e",
        clientSecret: '34db6a479de729d27a306384a3b722f26387ff18',
        callbackURL:'http://localhost:8080/api/sessions/githubcallback'
    }, async(accessToken, refreshToken, profile, done)=> {
        try{
            console.log(profile);
            let user = await userModel.findOne({email:profile._json.email});
            if(!user) {
                let newUser = {
                    first_name:profile._json.name,
                    last_name:'',
                    age:22,
                    email:profile._json.email,
                    password:'' 
                }
                let result = await userModel.create(newUser);
                done(null,result);
            }
        
         else {
            done(null,user);
         }
        }
         catch(error){
            return done(error);
         }
        
    }))

    passport.serializeUser((user, done) => {
        done(null, user._id);
    });

    passport.deserializeUser(async (_id, done) => {
        try {
            const user = await userModel.findOne({ _id });
            return done(null, user);
        } catch {
            return done({ message: "Error deserializing user" });
        }
    });
};


  
export default initializePassport;