import userModel from "../models/user.model.js";
import CustomError from "../services/customErrors.js";

export default class UsersDao {


    async findOne(email) {
        let user = await userModel.findOne(email)
        if(!user){
            CustomError.createError({
                name:"Error en la busqueda del usuario",
                cause:"User not found",
                message:"No se logro encontrar al usuario",
                code:EErrors.DATABASE_ERROR
            })
        }
        
        return user;
    }

    async updateOne(_id,password){
        let user = await userModel.updateOne({ _id: _id }, { $set: { password: password } })
        return user;
    }
}