import UsersDao from "../daos/users.dao.js";
export default class userRepository{
    constructor(){
        this.dao = new UsersDao()
    }

    findOne = async(email) => {
        return await this.dao.findOne(email);
    }

    updateOne = async(_id, password) => {
        return await this.dao.updateOne(_id, password);
    }
}