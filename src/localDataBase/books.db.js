import { Book } from '../classes/Book.js';

/**
 * Репозиторий книг в библиотеке
 * @method getBooks () : book[]
 * @method getBooksPayload () : bookPayload[]
 * @method addBook (payload) : newBook
 * @method deleteBook (payload) : {flag, message}
 */
class BooksDataBase {
    static #ID = 0;
    #books;

    constructor () {
        this.#books = new Set();
    }

    /**
     * @returns копию массива из объектов класса Book в репозитории
     */
    async getBooks () {
        const books = [];
        this.#books.forEach(book => {
            books.push(book);
        });
        return books;
    }

    /**
     * @returns копия массива полезной нагрузки пользователей в репозитории
     */
    async getBooksPayload () {
        const booksPayload = [];
        this.#books.forEach(book => {
            booksPayload.push(book.getPayload());
        });
        return booksPayload;
    }

    /**
     * Создает и добавляет книгу в репозиотрий
     * @param {*} payload.name - название книги
     * @param {*} payload.countPages - количесвто страниц
     * @param {*} payload.genre - жанр книги
     * @param {*} payload.authorId - id автора
     * @returns book - объект добавленной книги
     */
    async addBook (payload) {
        const { name, countPages, genre, authorId } = payload;
        const bookId = BooksDataBase.#ID;
        const book = new Book(name, countPages, genre, authorId, bookId);
        BooksDataBase.#ID++;
        this.#books.add(book);
        return book;
    }

    /**
     * Удаляет книгу из репозиотрия
     * @param {*} bookId id книги
     * @returns результат операции : book | undefined
     */
    async deleteBook (bookId) {
        let resolut;
        for (let book of this.#books) {
            if (book.getId() == bookId) {
                resolut = book;
                break;
            }
        }
        this.#books.delete(resolut);
        return resolut;
    }
}

/**
 * Репозиторий книг в библиотеке
 * @method getBooks() : book[]
 * @method getBooksPayload() : bookPayload[]
 * @method addBook(payload) : newBook
 * @method deleteBook(payload) : {flag, message}
 */
export const booksDB = new BooksDataBase();
