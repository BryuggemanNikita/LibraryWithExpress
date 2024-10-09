import { booksDB } from '../localDataBase/books.db.js';

/**
 * Класс с методами, реализующий фильтрацию книг по данным
 * @method getById (bookId) : book | undefined
 * @method getByRegExp(findName) : bookPayload[]
 */
class BooksFilter {
    /**
     * Поиск книги в бд по заданному id
     * @param {*} bookId - id искомой книги
     * @returns экземпляр класса Book
     */
    async getById (bookId) {
        const books = await booksDB.getBooks();
        let resolut;
        for (let book of books) {
            if (book.getId() === bookId) {
                resolut = book;
                break;
            }
        }
        return resolut;
    }

    /**
     * Поиск книг по совпадениям в названии | подстроке
     * @param {*} findName - искомое название | подстрока
     * @returns массив авторов(payload)
     */
    async getByRegExp (findName) {
        const books = await booksDB.getBooks();
        const resBooks = [];
        books.forEach(book => {
            const bookName = book.getName();
            if (bookName.includes(findName)) {
                const bookPayload = book.getPayload();
                resBooks.push(bookPayload);
            }
        });
        return resBooks;
    }
}

/**
 * экземпляр класса, реализующий фильтрацию книг по данным
 * @method getById (bookId) : book | undefined
 * @method getByRegExp(findName) : bookPayload[]
 */
export const bookFilter = new BooksFilter();
