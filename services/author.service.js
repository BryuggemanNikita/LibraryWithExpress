import { Author } from '../author/Author.js';

export class AuthorService {
    static ID = 0;

    constructor () {
        this.authors = new Set();
    }

    addNewAuthor (name, surname) {
        let thisID = AuthorService.ID;
        const author = new Author(name, surname, thisID);
        this.authors.add(author);
        AuthorService.ID++;
    }

    getAuthors () {
        const arr = []
        this.authors.forEach(e => {
            arr.push(e)
        });
        return [...arr];
    }

    getAuthorByID (id) {
        let author = null;
        this.authors.forEach(e => {
            if (e.getID() === id) author = e;
        });
        return author;
    }

    deleteAuthorByID (id) {
        this.authors.delete(id);
    }
}
