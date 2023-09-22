import mongoose from 'mongoose';

const ticketCollection = 'tickets'

const ticketSchema = new mongoose.Schema({
    code:{
        type: String
        
    },
    purchase_datetime: {
        type: String
    },
    amount: Number,
    purchaser: String
})

export const ticketModel = mongoose.model(ticketCollection, ticketSchema);