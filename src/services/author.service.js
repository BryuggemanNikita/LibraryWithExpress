import { userService } from './auth.service.js';

export class AuthorService {
    async hasByFullname (name) {
        const authors = await userService.getAuthors();
        let flag = false;
        authors.forEach(e => {
            if (e.name == name) {
                flag = true;
                return;
            }
        });
        return flag;
    }


    async hasByAuthorID (authorID) {
        const authors = await userService.getAuthors();
        let flag = false;
        authors.forEach(e => {
            if (e.id == authorID) flag = true;
        });
        return flag;
    }

    async getAuthorsByRegExp (fullname) {
        const authors = await userService.getAuthors();
        let resAuthors = [];
        
        authors.forEach(e => {
            if (e.name.includes(fullname)) resAuthors.push(e);
        });

        return resAuthors;
    }

    async getAuthors () {
        const authors = await userService.getAuthors();
        const arr = [];
        authors.forEach(e => {
            arr.push(e);
        });
        return arr;
    }

    async getAuthorByID (id) {
        const authors = await userService.getAuthors();
        let author = null;
        try {
            authors.forEach(e => {
                if (e.id === id) {
                    author = e;
                    throw new Error();
                }
            });
        } finally {
            return author;
        }
    }

    // async addNewAuthor (name, surname) {
    //     const isDublic = await this.hasByFullname(name);
    //     if (isDublic) {
    //         return false;
    //     }
    //     let thisID = AuthorService.ID;
    //     const author = new Author(name, surname, thisID);
    //     const authors = await userService.getAuthors();
    //     authors.add(author);
    //     await libraryService.addNewAuthorInLibrary(thisID);
    //     AuthorService.ID++;
    //     return true;
    // }

    // async updateAuthorInfoByID (id, newName, newSurname) {
    //     const author = await this.getAuthorByID(id);
    //     if (!author) return false;
    //     const isDublic = await this.hasByFullname(newName, newSurname);
    //     if (isDublic) return false;
    //     author.setName(newName);
    //     author.setSurname(newSurname);
    //     return true;
    // }

    // async deleteAuthorByID (id) {
    //     const author = await this.getAuthorByID(id);
    //     if (!author) return false;
    //     const authors = await userService.getAuthors();
    //     return authors.delete(author);
    // }
}
