import mongoose from 'mongoose';

const chatCollection = 'chat' 

const chatSchema = new mongoose.Schema({
    sender: {
        type: String,
        required: true,
    },
    message: {
        type: String,
        required: true,
    },
    timestamp: {
        type: String,
        default: Date.now.toString,
    }
});

export const chatModel = mongoose.model(chatCollection, chatSchema);