import ChatDao from "../daos/chat.dao.js";

export default class chatRepository{
    constructor(){
        this.dao =  new ChatDao();
    }

    async getAll(){
        return await this.dao.getAll();
    }

    async getMessagesBySender(sender){
        return await this.dao.getMessagesBySender(sender);
    }

    async sendMessage(sender, message){
        return await this.dao.sendMessage(sender, message);
    }
}