import userModel from "../models/user.model.js";
import CustomError from "../services/customErrors.js";
import EErrors from "../services/enums.js";

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
}