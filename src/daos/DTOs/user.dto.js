export default class UserDTO {
    constructor(user){
        this.name = user.name
        this.email = user.email
        this.age = user.age
        this.password = user.password
        this.role = user.role
    }
}