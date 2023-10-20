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

    sendEmail = async(email) =>{
        return await this.dao.sendEmail(email);
    }

    roleChange = async(email, newRole) =>{
        return await this.dao.roleChange(email, newRole);
    }

    logoutLastConnection = async(currentUser) => {
        return await this.dao.logoutLastConnection(currentUser);
    }

    getAllUsers = async() =>{
        return await this.dao.getAllUsers();
    }

    deleteInactiveUsers = async() =>{
        return await this.dao.deleteInactiveUsers();
    }

    deleteUser = async(email) =>{
        return await this.dao.deleteUser(email);
    }
}