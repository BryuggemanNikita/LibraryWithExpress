import { Author } from '../classes/author/Author.js';
import { libraryService } from '../endpoints/library.endpoint.js';

export class AuthorService {
    static ID = 0;

    constructor () {
        this.authors = new Set();
    }

    async hasByFullname (name, surname) {
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

    async hasByAuthorID (authorID) {
        const authors = this.authors;
        let flag = false;
        authors.forEach(e => {
            if (e.getID() == authorID) flag = true;
        });
        return flag;
    }

    async getAuthorsByRegExp (fullname) {
        const authors = this.authors;
        let resAuthors = [];
        
        authors.forEach(e => {
            if (e.getFullName().includes(fullname)) resAuthors.push(e);
        });

        return resAuthors;
    }

    async getAuthors () {
        const arr = [];
        this.authors.forEach(e => {
            arr.push(e);
        });
        return arr;
    }

    async getAuthorByID (id) {
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

    async addNewAuthor (name, surname) {
        const isDublic = await this.hasByFullname(name, surname);
        if (isDublic) {
            return false;
        }
        let thisID = AuthorService.ID;
        const author = new Author(name, surname, thisID);
        this.authors.add(author);
        await libraryService.addNewAuthorInLibrary(thisID);
        AuthorService.ID++;
        return true;
    }

    async updateAuthorInfoByID (id, newName, newSurname) {
        const author = await this.getAuthorByID(id);
        if (!author) return false;
        const isDublic = await this.hasByFullname(newName, newSurname);
        if (isDublic) return false;
        author.setName(newName);
        author.setSurname(newSurname);
        return true;
    }

    async deleteAuthorByID (id) {
        const author = await this.getAuthorByID(id);
        if (!author) return false;
        return this.authors.delete(author);
    }
}
