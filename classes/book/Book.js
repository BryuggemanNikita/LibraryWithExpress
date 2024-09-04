export class Book {
    constructor (name, countPages, genre, authorID, id) {
        this.name = name;
        this.countPages = countPages;
        this.genre = genre;
        this.authorID = authorID;
        this.id = id;
    }

    getNAme () {
        return this.name;
    }

    getCountPages () {
        return this.countPages;
    }

    getGenre(){
        return this.genre;
    }

    getAuthorID () {
        return this.authorID;
    }

    getID(){
        return this.id;
    }

    setName(newName){
        this.name = newName;
    }

    setCountPages(newCountPages){
        this.countPages = newCountPages;
    }

    setGenre(newGenre){
        this.genre = newGenre;
    }
}
