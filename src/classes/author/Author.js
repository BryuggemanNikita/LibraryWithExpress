export class Author {
    constructor (name, surname, id) {
        this.name = name;
        this.surname = surname;
        this.id = id;
    }

    getFullName () {
        return `${this.name} ${this.surname}`;
    }

    getID () {
        return this.id;
    }

    getName () {
        return this.name;
    }

    getSurname () {
        return this.surname;
    }

    setName (newName) {
        this.name = newName;
    }

    setSurname (newSurname) {
        this.surname = newSurname;
    }
}
