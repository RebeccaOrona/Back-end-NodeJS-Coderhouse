import passport from 'passport';
import local from 'passport-local';
import userModel from '../models/Users.model.js'; 
import { createHash,isValidPassword,generateToken } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import env from './enviroment.js';

const localStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

const cookieExtractor = (req) => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies['cookieToken']
    }
    return token;
}

const initializePassport = () => {

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest:extractJwt.fromExtractors([cookieExtractor]),
        secretOrKey:env.PRIVATE_KEY,
    }, async(jwt_payload,done) => {
        try{
            return done(null,jwt_payload);
        }
        catch(err) {
            return done(err);
        }
    }))

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
                const access_token = generateToken(result,req.res);
                return done(null,access_token);
            }catch(error){
                return done("Error al crear el usuario: "+error);
            }
 
        }))
    

    passport.use('login', new localStrategy(
        {passReqToCallback:true,usernameField:'email'}, async (req, username, password, done) => {
        try {
            if (username === 'adminCoder@coder.com' && password === 'adminCod3r123') {
                const user = {
                    first_name:'admin',
                    last_name:' ',
                    email:'adminCoder@coder.com',
                    password:'adminCod3r123',
                    age:0,
                    role:'usuario'
                }
                const access_token = generateToken(user, req.res);
                done(null, access_token);
            }
            const user = await userModel.findOne({ email: username });
            if (!user) return done(null, false, { message: "User not found" });
            if (!isValidPassword(user, password)) return done(null, false);
            
            const access_token = generateToken(user, req.res);
            done(null, access_token);
            
        } catch (error) {
            done(error);
        }
    }));

    passport.use('github',new GitHubStrategy({
        passReqToCallback:true,
        clientID:env.clientID,
        clientSecret: env.clientSecret,
        callbackURL:env.callbackURL
    }, async(req, accessToken, refreshToken, profile, done)=> {
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
            const access_token = generateToken(user, req.res);
            done(null,access_token);
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
        } catch (error){
            return done(error);
        }
    });
};


  
export default initializePassport;