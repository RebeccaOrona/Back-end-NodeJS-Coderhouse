import { chatModel } from "../models/chat.model.js";
import ChatDTO from "./DTOs/chat.dto.js";
import moment from "moment-timezone";

export default class ChatDao { 

    async getAll() {
        let messages = await chatModel.find().sort({ timestamp: 'desc' })
        return messages;
    }

    async getMessagesBySender(sender){
        try{
        let messages = await chatModel.find({ sender: sender })
            .sort({ timestamp: 'asc' }) // Sort by timestamp in ascending order
            .exec()

            return messages;
        } catch(error) {
            req.logger.error('Error retrieving chat history:', error);
        };
    }

    async sendMessage(sender,message){
        let newChat = new ChatDTO({
            sender: sender,
            message: message,
            timestamp: moment().tz('America/Argentina/Buenos_Aires').format('DD-MM-YYYY, HH:mm:ss')
        });
        let sentMessage = await chatModel.create(newChat)
        return sentMessage;
    }

}