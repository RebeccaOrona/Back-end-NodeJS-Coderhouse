import SessionsDao from "../daos/sessions.dao.js";

export class SessionsService {
    
    constructor() {
        this.dao = new SessionsDao();
    }

    findOne(email) {
        return this.dao.findOne(email);
    }

    updateOne(_id, password) {
        return this.dao.updateOne(_id, password);
    }



    
}