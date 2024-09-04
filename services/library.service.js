export class LibraryService {
    constructor () {
        this.library = new Map();
    }

    getAll () {
        return this.library;
    }

    getByID (id) {
        return this.library.get(id);
    }

    addNewAuthorInLibrary (authorID) {
        this.library.set(authorID, []);
    }

    addBook (book, authorID) {
        const lib = this.library.get(authorID);
        lib.push(book);
    }
}
