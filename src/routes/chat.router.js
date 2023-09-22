import express from 'express';
import { passportCall } from '../utils.js';
import { findSenderMessages, getChat, sendMessage } from '../controllers/chat.controller.js';

const chatRouter = express.Router();



chatRouter.get('/', getChat);

chatRouter.post('/send', passportCall('jwt'), sendMessage);

chatRouter.get('/:sender', findSenderMessages);



export default chatRouter;