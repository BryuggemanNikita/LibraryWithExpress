export class UserDto{
    name;
    email;
    _id;

    constructor(name, email, id){
        this.name = name;
        this.email = email;
        this._id = id;
    }
}