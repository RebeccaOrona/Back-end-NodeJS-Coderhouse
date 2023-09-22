import { authorization } from "../utils.js";
import { ChatService } from "../repositories/index.js";

export const getChat = async (req, res) => {
    try {
        let chat = await ChatService.getAll();
        res.status(200).send({chat})
    } catch (error) {
        res.status(500).json({ error: 'Failed to get messages' });
    }
}

export const sendMessage = (req, res) => { authorization("usuario")(req,res, async() =>{
    try {
        let sender = req.user.user.email;
        console.log(sender)
        let { message } = req.body;
        console.log(message)
        let result = await ChatService.sendMessage(sender, message);
        res.status(200).send({result})
    } catch (error) {
        res.status(500).json({ error: 'Failed to send the message' });
    }
}
)}

export const findSenderMessages = async (req, res) => {
    try {
        let { sender } = req.params;
        // let sender = req.user.user.email;
        let messages = await ChatService.getMessagesBySender(sender);
        res.send(messages)
    } catch (error) {
        res.status(500).json({ error: 'Failed to get messages' });
    }

}