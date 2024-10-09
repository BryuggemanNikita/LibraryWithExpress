import { booksDB } from '../localDataBase/books.db.js';
import { libraryDB } from '../localDataBase/library.db.js';
import { bookFilter } from '../filtersForDataBases/booksFilter.js';
import { authorsFilter } from '../filtersForDataBases/authorsFilter.js';
import { validationResult } from 'express-validator';

/**
 * Сервер взаимодействия с Books
 * @method getAll : {message, book[]}
 * @method getByID : {message, book(payload) | undefined}
 * @method getByRegExp : {message, book(payload) | undefined}
 * @method addNew : {message}
 * @method deleteByID : {message}
 */
class BookService {
    /**
     * Поиск всех книг(payload)
     * @returns ответ {message, books(payload)}
     */
    async getAll (req, res) {
        const books = await booksDB.getBooksPayload();
        const len = books.length;
        if (len == 0) {
            return res.status(404).json({ message: 'Книги отсутствуют' });
        }
        res.status(200).json({ message: 'Успешно', books });
    }

    /**
     * поиск книги по id
     * @returns ответ {message, book(payload)}
     */
    async getByID (req, res) {
        const { bookId } = req.body;
        const book = await bookFilter.getById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Книга не найдена' });
        }
        const bookPayload = book.getPayload();
        return res.status(200).json({ message: 'Успешно', bookPayload });
    }

    /**
     * Поиск книг по названию
     * @returns ответ {message, books(payload)}
     */
    async getByRegExp (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                message: 'Ошибка поиска',
                errors
            });
        }

        const { findName } = req.body;

        const books = await bookFilter.getByRegExp(findName);
        const len = books.length;
        if (len === 0) {
            return res
                .status(404)
                .json({ message: 'Книг по запросу не найдено', books });
        }
        res.status(200).json({ message: 'Успешно', books });
    }

    /**
     * Создает книгу в репозиотрии библиотеке и книг
     * @returns ответ {message}
     */
    async addNew (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ message: 'Ошибка при запросе', errors });
        }

        const { name, countPages, genre, authorId } = req.body;

        // проверка на наличие автора в системе
        const author = await authorsFilter.getByID(authorId);
        if (!author) {
            return res.status(400).json({
                message: 'Автора с данным id нет в системе'
            });
        }

        const payLoad = { name, countPages, genre, authorId };
        const book = await booksDB.addBook(payLoad);
        const flagResolut = await libraryDB.addBook(book, authorId);

        if (!flagResolut) {
            return res.status(400).json({
                message: 'Ошибка при попытке добавить книгу в библиотеку'
            });
        }
        return res.status(200).sendStatus(200);
    }

    /**
     * Удаляет книгу из репозиотрия библиотеки и книг
     * @returns ответ {message}
     */
    async deleteByID (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res
                .status(400)
                .json({ message: 'Ошибка входных данных', errors });
        }
        const { bookId } = req.body;
        const book = await booksDB.deleteBook(bookId);
        if (!book) {
            return res.status(400).json({
                message: 'Не удалось удалить книгу из репозитория книг'
            });
        }
        const authorId = book.getAuthorID();
        const flag = await libraryDB.deleteBy2ID(bookId, authorId);
        if (!flag) {
            res.status(400).json({
                message: 'Не удалось удалить книгу из библиотеки'
            });
        }
        res.status(200).json({ message: 'Успешно' });
    }
}

/**
 * Экземпляр класса
 * @method getAll : {message, book[]}
 * @method getByID : {message, book(payload) | undefined}
 * @method getByRegExp : {message, book(payload) | undefined}
 * @method addNew : {message}
 * @method deleteByID : {message}
 */
export const bookService = new BookService();

// async updateBookInfoByID (bookID, newName, newCountPages, newGenre) {
//     const book = await this.getByID(bookID);
//     if (!book) {
//         return false;
//     }
//     if (newName) {
//         book.setName(newName);
//     }
//     if (newCountPages) {
//         book.setCountPages(newCountPages);
//     }
//     if (newGenre) {
//         book.setGenre(newGenre);
//     }
//     return true;
// }
