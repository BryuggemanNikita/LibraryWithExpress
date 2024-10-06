import { Book } from '../classes/Book.js';

export class BookService {
    static ID = 0;

    constructor () {
        this.books = new Set();
    }

    async getAll () {
        const arr = [];
        this.books.forEach(e => {
            arr.push(e);
        });
        return arr;
    }

    async getByID (bookID) {
        const books = this.books;
        let book = null;
        try {
            books.forEach(e => {
                if (e.getID() === bookID) {
                    book = e;
                    throw new Error();
                }
            });
        } finally {
            return book;
        }
    }

    async getByBooksByRegExp (name) {
        const books = this.books;
        let resBooks = [];
        books.forEach(e => {
            const bookName = e.name;
            if (bookName.includes(name)) resBooks.push(e);
        });
        return resBooks;
    }

    async addNew (name, countPages, genre, authorID) {
        const book = new Book(
            name,
            countPages,
            genre,
            authorID,
            BookService.ID
        );
        this.books.add(book);
        BookService.ID++;
        return book;
    }

    async updateBookInfoByID (bookID, newName, newCountPages, newGenre) {
        const book = await this.getByID(bookID);
        if (!book) {
            return false;
        }
        if (newName) {
            book.setName(newName);
        }
        if (newCountPages) {
            book.setCountPages(newCountPages);
        }
        if (newGenre) {
            book.setGenre(newGenre);
        }
        return true;
    }

    async deleteByID (bookID) {
        const books = this.books;
        let book = null;
        books.forEach(e => {
            if (e.getID() == bookID) book = e;
        });
        this.books.delete(book);
        return book;
    }
}
