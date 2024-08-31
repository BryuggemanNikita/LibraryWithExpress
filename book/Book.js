export class Book {
    constructor (name, countPages, authorID) {
        this.name = name;
        this.countPages = countPages;
        this.authorID = authorID;
    }

    getNAme () {
        return this.name;
    }

    getCountPages () {
        return this.countPages;
    }

    getAuthorID () {
        return this.authorID;
    }
}
