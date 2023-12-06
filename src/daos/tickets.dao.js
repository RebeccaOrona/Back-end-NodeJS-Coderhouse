import { ticketModel } from "../models/ticket.model.js";

export default class TicketDao {

    async create(ticket){
        const createdTicket = await ticketModel.create(ticket);
        return createdTicket;
    }
    
}