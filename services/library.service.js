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

    deleteBy2ID (authorID, bookID) {
        const authorLibrary = this.library.get(authorID);
        let newLib = authorLibrary.filter(e => e.getID() !== bookID);
        this.library.set(authorID, newLib);
    }

    deleteAuthorLibrary (authorID) {
        const lib = this.library.get(authorID);
        const bookIDs = lib.map(e => (e = e.getID()));
        this.library.delete(authorID);
        return bookIDs;
    }
}
