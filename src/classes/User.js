export class User{
    name;
    email;
    password;
    roles;
    constructor(name, email, password, role){
        this.name = name;
        this.email = email;
        this.password = password;
        this.roles = [role];
    }

    getName(){
        return this.name;
    }
    getEmail(){
        return this.email;
    }
    getPassword(){
        return this.password;
    }
    getRole(){
        return this.roles;
    }
}