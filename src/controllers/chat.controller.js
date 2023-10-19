import { authorization } from "../config-middlewares/authorization.js";
import { ChatService } from "../repositories/index.js";

export const getChat = async (req, res) => {
    try {
        let chat = await ChatService.getAll();
        res.status(200).send({chat})
    } catch (error) {
        req.logger.error(error);
        res.status(500).json({ error: 'Failed to get messages' });
    }
}

export const sendMessage = (req, res) => { authorization("usuario")(req,res, async() =>{
    try {
        let sender = req.user.user.email;
        let { message } = req.body;
        let result = await ChatService.sendMessage(sender, message);
        res.status(200).send({result})
    } catch (error) {
        res.status(500).json({ error: 'Failed to send the message' });
        req.logger.error(error);
    }
}
)}

export const findSenderMessages = async (req, res) => {
    try {
        let { sender } = req.params;
        let messages = await ChatService.getMessagesBySender(sender);
        res.send(messages)
    } catch (error) {
        res.status(500).json({ error: 'Failed to get messages' });
        req.logger.error(error);
    }

}