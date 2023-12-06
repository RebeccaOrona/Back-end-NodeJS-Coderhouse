import TicketDao from "../daos/tickets.dao.js";
export default class ticketRepository{
    constructor(){
        this.dao = new TicketDao();
    }

    createTicket = async(ticket) => {
        return await this.dao.create(ticket);
    }
}

