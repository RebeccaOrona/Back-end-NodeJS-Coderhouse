import userModel from "../models/user.model.js";
import CustomError from "../services/customErrors.js";
import EErrors from "../services/enums.js";
import env from '../config-middlewares/environment.js';
import { transport } from "../utils.js";
import jwt from 'jsonwebtoken'
import UserDTO from "./DTOs/user.dto.js";

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

        const resetLink = `https://back-end-nodejs-coderhouse-production.up.railway.app/resetPassword?token=${token}&exp=${expirationTime}`;
        let result = await transport.sendMail({
            from:`Rebecca Orona <${env.email_user}>`,
            to:email,
            subject:'Restablecimiento de contraseña',
            html:`
            <div>
                <h1> Restablecimiento de contraseña </h1>
                <p> Para establecer su contraseña <a href=${resetLink}>ingrese aquí</a></p>
                <p> ¿No es necesario cambiar la contraseña? <a href="https://back-end-nodejs-coderhouse-production.up.railway.app/">Inicia sesion aquí</a></p>
            </div>
            `,
            attachments:[]
        })
        return result;
    }

    async roleChange(email, newRole){
        let user = await userModel.findOne({ email: email });
        user.role = newRole;
        const updatedUser = await user.save();
        return updatedUser;
    }

    async logoutLastConnection(currentUser) {
        try {
            const user = await userModel.findOne({ email: currentUser.email });
        
            if (user) {
              // User found, update the 'last_connection' property
              user.last_connection = new Date();
              await user.save();
            } 
        }catch (error) {
            console.error('Error updating user last_connection:', error);
          }
        }
    async getAllUsers(){
        let users = await userModel.find();
        let userDtoArray = users.map(userData => new UserDTO(userData));
        return userDtoArray
    }

    async deleteInactiveUsers(){
    try {
        let users = await userModel.find().lean();
        let deletedUsers = [];
        const currentTime = new Date();

        for (const user of users) {
            const lastConnectionTime = new Date(user.last_connection);
            const timeDifferenceInMinutes = (currentTime - lastConnectionTime) / (1000 * 60);
            if(timeDifferenceInMinutes >= 30){
                let result = await userModel.deleteOne({ _id: user._id }).catch(error => {
                    console.error("Error deleting user:", error);
                  });

                if (result.acknowledged) {
                    await transport.sendMail({
                        from:`Rebecca Orona <${env.email_user}>`,
                        to:user.email,
                        subject:'Su cuenta acaba de ser eliminada',
                        html:`
                        <div>
                            <p style="color: black;">Nos comunicamos con usted para avisarle que su cuenta
                            lamentablemente acaba de ser eliminada por inactividad</p>
                            <p style="color: black;"> ¿Piensa que ocurrio un error? Comuniquese con nosotros</p>
                            <p style="color: black;"> ¿Desea crear una nueva cuenta? <a href="https://back-end-nodejs-coderhouse-production.up.railway.app/register">Cree una aquí</a></p>

                            <p style="color: black;">Comercio Blahaj</p>
                        </div>
                        `,
                        attachments:[]
                    })
                    deletedUsers.push(user);
                }
            }
        }
        return deletedUsers;
    } catch (error) {
        console.error('Error in deleteInactiveUsers:', error);
      }
    }

    async deleteUser(email){
        try{
            console.log(email)
            let deletedUser = await userModel.deleteOne({ email: email })
            if (deletedUser.deletedCount > 0) {
                // The user was successfully deleted
                return deletedUser;
            } else {
                console.error('User not found or not deleted.');
                return null;
            }

        } catch (error) {
        console.error('Error in deleteUser:', error);
      }
    }
}