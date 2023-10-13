import userModel from "../models/user.model.js";
import CustomError from "../services/customErrors.js";
import EErrors from "../services/enums.js";
import env from '../config-middlewares/environment.js';
import { transport } from "../utils.js";
import jwt from 'jsonwebtoken'

export default class UsersDao {

    async findOne(email) {
        let user = await userModel.findOne(email)
        if(!user){
            CustomError.createError({
                name:"Failed to find the user",
                cause:"User not found",
                message:"User not found",
                code:EErrors.DATABASE_ERROR
            })
        }
        
        return user;
    }

    async updateOne(_id,password){
        let user = await userModel.updateOne({ _id: _id }, { $set: { password: password } })
        return user;
    }

    async sendEmail(email) {
        const secretKey = env.PRIVATE_KEY;
        const expirationTime = Math.floor(Date.now() / 1000) + 3600;
        const token = jwt.sign({ email, exp: expirationTime}, secretKey);

        const resetLink = `http://localhost:8080/resetPassword?token=${token}&exp=${expirationTime}`;
        let result = await transport.sendMail({
            from:`Rebecca Orona <${env.email_user}>`,
            to:email,
            subject:'Restablecimiento de contraseña',
            html:`
            <div>
                <h1> Restablecimiento de contraseña </h1>
                <p> Para establecer su contraseña <a href=${resetLink}>ingrese aquí</a></p>
                <p> ¿No es necesario cambiar la contraseña? <a href="http://localhost:8080/">Inicia sesion aquí</a></p>
            </div>
            `,
            attachments:[]
        })
        return result;
    }

    async roleChange(uid){
        let user = await userModel.findOne(uid);
        if(user.role == "usuario"){
            user.role = "premium";
        } else if(user.role == "premium"){
            user.role = "usuario";
        }
        return await user.save();
    }
}