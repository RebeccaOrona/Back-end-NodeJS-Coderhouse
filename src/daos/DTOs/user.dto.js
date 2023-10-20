export default class UserDTO {
    constructor({ first_name, last_name, email, age, role }){
        this.name = `${first_name} ${last_name}`;
        this.email = email;
        this.age = age;
        this.role = role;
    }
}