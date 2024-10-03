export class LibraryService {
    constructor () {
        this.library = new Map();
    }

    async getAll () {
        return this.library;
    }

    async getByID (id) {
        return this.library.get(id);
    }

    async addNewAuthorInLibrary (authorID) {
        this.library.set(authorID, []);
    }

    async addBook (book, authorID) {
        const lib = this.library.get(authorID);
        lib.push(book);
    }

    async deleteBy2ID (authorID, bookID) {
        const authorLibrary = this.library.get(authorID);
        let newLib = authorLibrary.filter(e => e.getID() !== bookID);
        this.library.set(authorID, newLib);
    }

    async deleteAuthorLibrary (authorID) {
        const lib = this.library.get(authorID);
        const bookIDs = lib.map(e => (e = e.getID()));
        this.library.delete(authorID);
        return bookIDs;
    }
}
