import { Book } from '../classes/book/Book.js';

export class BookService {
    static ID = 0;

    constructor () {
        this.books = new Set();
    }

    getAll () {
        const arr = [];
        this.books.forEach(e => {
            arr.push(e);
        });
        return arr;
    }

    getByID (bookID) {
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

    getByBooksByRegExp (name) {
        const books = this.books;
        const reg = new RegExp(`(${name})`);
        let resBooks = [];
        books.forEach(e => {
            if (reg.test(e.getName())) resBooks.push(e);
        });
        return resBooks;
    }

    addNew (name, countPages, genre, authorID) {
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

    updateBookInfoByID (bookID, newName, newCountPages, newGenre) {
        const book = this.getByID(bookID);
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

    deleteByID (bookID) {
        const books = this.books;
        books.forEach(e => {
            if (e.getID() == bookID) this.books.delete(e);
        });
    }
}
