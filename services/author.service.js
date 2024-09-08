import { Author } from '../classes/author/Author.js';
import { libraryService } from '../endpoints/library.endpoint.js';

export class AuthorService {
    static ID = 0;

    constructor () {
        this.authors = new Set();
    }

    hasByFullname (name, surname) {
        const authors = this.authors;
        let flag = false;
        authors.forEach(e => {
            if (e.getName() == name && e.getSurname() == surname) {
                flag = true;
                return;
            }
        });
        return flag;
    }

    hasByAuthorID (authorID) {
        const authors = this.authors;
        let flag = false;
        authors.forEach(e => {
            if (e.getID() == authorID) flag = true;
        });
        return flag;
    }

    getAuthorsByRegExp (fullname) {
        const authors = this.authors;
        let resAuthors = [];
        const reg = new RegExp(`(${fullname})`);

        authors.forEach(e => {
            if (reg.test(e.getFullName())) resAuthors.push(e);
        });

        return resAuthors;
    }

    getAuthors () {
        const arr = [];
        this.authors.forEach(e => {
            arr.push(e);
        });
        return arr;
    }

    getAuthorByID (id) {
        const authors = this.authors;
        let author = null;
        try {
            authors.forEach(e => {
                if (e.getID() === id) {
                    author = e;
                    throw new Error();
                }
            });
        } finally {
            return author;
        }
    }

    addNewAuthor (name, surname) {
        if (this.hasByFullname(name, surname)) {
            return false;
        }
        let thisID = AuthorService.ID;
        const author = new Author(name, surname, thisID);
        this.authors.add(author);
        libraryService.addNewAuthorInLibrary(thisID);
        AuthorService.ID++;
        return true;
    }

    updateAuthorInfoByID (id, newName, newSurname) {
        const author = this.getAuthorByID(id);
        if (!author) return false;
        if (this.hasByFullname(newName, newSurname)) return false;
        author.setName(newName);
        author.setSurname(newSurname);
        return true;
    }

    deleteAuthorByID (id) {
        const author = this.getAuthorByID(id);
        if (!author) return false;
        return this.authors.delete(author);
    }
}
