export class Author{
    constructor(name, surname, id){
        this.name = name;
        this.surname = surname;
        this.id = id;
    };

    getFullName(){
        return `${this.name} ${this.sername}`;
    };

    getID(){
        return this.id;
    }
}