import userModel from "../models/Users.model.js";

export default class SessionsDao {


    async findOne(email) {
        let user = await userModel.findOne(email)
        return user;
    }

    async updateOne(_id,password){
        let user = await userModel.updateOne({ _id: _id }, { $set: { password: password } })
        return user;
    }
}