export default class ChatDTO {
    constructor(message){   
        this.sender = message.sender
        this.message = message.message
        this.timestamp = message.timestamp
    }
}