import passport from 'passport';
import local from 'passport-local';
import userModel from '../models/user.model.js'; 
import { createHash,isValidPassword,generateToken } from '../utils.js';
import GitHubStrategy from 'passport-github2';
import jwt from 'passport-jwt';
import env from './environment.js';
import CustomError from '../services/customErrors.js';
import EErrors from '../services/enums.js';
import { generateUserErrorInfo } from '../services/info.js';

const localStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const extractJwt = jwt.ExtractJwt;

export const cookieExtractor = (req) => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies['cookieToken']
    }
    return token;
}

const jwtOptions = {
    jwtFromRequest: cookieExtractor,
    secretOrKey: env.PRIVATE_KEY,
  };

const initializePassport = () => {


    passport.use('jwt', new JWTStrategy(jwtOptions, async(jwt_payload,done) => {
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
            
            if(!first_name || !last_name || !email || !age){
                CustomError.createError({
                    name:"Error en la creacion del usuario",
                    cause:generateUserErrorInfo({first_name,last_name,email,age}),
                    message:"Falto algun campo que rellenar",
                    code:EErrors.INVALID_TYPES_ERROR
                })
                return done(null,false)
            } else if(typeof first_name !== 'string' ||
                typeof last_name !== 'string' ||
                typeof email !== 'string' ||
                typeof age !== 'string') {
                    CustomError.createError({
                        name:"Error en la creacion del usuario",
                        cause:generateUserErrorInfo({first_name,last_name,email,age}),
                        message:"Es necesario que los campos se rellenen correctamente",
                        code:EErrors.INVALID_TYPES_ERROR
                    })
                    return done(null,false)
                }
            try{
                let user = await userModel.findOne({email:username});
                if(user){
                    req.logger.error("User already exists");
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
            let user;
            if (username == 'adminCoder@coder.com' && password == 'adminCod3r123') {
                const user = {
                    first_name:'admin',
                    last_name:' ',
                    email:'adminCoder@coder.com',
                    password:'adminCod3r123',
                    age:999,
                    role:'admin'
                }
                const access_token = generateToken(user, req.res);
                return done(null, access_token);
            } else {

                user = await userModel.findOne({ email: username });

                if (!user) {
                    CustomError.createError({
                        name:"Error en la busqueda del usuario",
                        cause:"User not found",
                        message:"No se logro encontrar al usuario",
                        code:EErrors.DATABASE_ERROR
                    })
                    return done(null, false, { message: "User not found" });
                }

                if (!isValidPassword(user, password)) {
                    return done(null, false);
                }
            }
            user.last_connection = new Date();
            user.save()
            const access_token = generateToken(user, req.res);
            done(null, access_token);
            
        } catch (error) {
            done(error);
        }
    }));

    passport.use('github',new GitHubStrategy({
        passReqToCallback:true,
        clientID:env.CLIENT_ID,
        clientSecret: env.CLIENT_SECRET,
        callbackURL:env.CALLBACK_URL
    }, async(req, accessToken, refreshToken, profile, done)=> {
        try{
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
