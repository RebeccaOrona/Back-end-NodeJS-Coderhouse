import {fileURLToPath} from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import env from './config/enviroment.js';


export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10)); // hash

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password); // true/false

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PRIVATE_KEY = env.PRIVATE_KEY;

export const generateToken = (user, res) =>{
    const token = jwt.sign({user}, PRIVATE_KEY, {expiresIn:'24h'});
    res.cookie('cookieToken', token,{
        maxAge:60*60*1000,
        httpOnly:false
    })
    return token;
}

export const authToken = (req,res,next) =>{
    const authHeader = req.headers.authorization;
    if(!authHeader) return res.status(401).send({error:"Not authenticated"})

    const token = authHeader.split(' ')[1];
    jwt.verify(token, PRIVATE_KEY,(error,credentials) => {
        if(error) return res.status(403).send({error:"Not authorizated"})
        req.user = credentials.user;
        next();
    })
}


export const passportCall = (strategy) => {
    return async(req,res,next) =>{
        passport.authenticate(strategy, function(err,user,info){
            if(err) return next(err);
            if(!user){
                return res.status(401).send({error:info.messages?info.messages:info.toString()})
            }
            req.user = user;
            console.log(req.user)
            next();
        })(req,res,next);
    }
}

export const authorization = (role) =>{
    return async(req,res,next) => {
        console.log(req.user)
        if(!req.user) return res.status(401).send({error:"Unauthorized"});
        if(req.user.user.role != role) return res.status(403).send({error:"No permissions"});
        next();
    }
}


export default __dirname;