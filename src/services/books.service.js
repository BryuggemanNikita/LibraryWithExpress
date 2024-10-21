import { libraryRepository } from '../repositories/libraryRepository.js';
import { booksRepository } from '../repositories/booksRepository.js';
import { usersRepository } from '../repositories/usersRepository.js';
import { Role } from '../enums/role.enum.js';
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
        const books = await booksRepository.getBooks();

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
        const book = await booksRepository.getById(bookId);
        if (!book.length) {
            return res.status(404).json({ message: 'Книга не найдена' });
        }
        return res.status(200).json({ message: 'Успешно', book });
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
        const books = await booksRepository.getByRegExp(findName);
        if (!books.length) {
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
        const user = await usersRepository.getById(authorId);

        if (!user) {
            return res
                .status(400)
                .json({ message: 'Пользователя нет в системе' });
        }
        if (!user.roles.includes(Role.AUTHOR)) {
            return res.status(400).json({
                message: 'Пользователь не является автором'
            });
        }

        const payLoad = { name, countPages, genre };
        const book = await booksRepository.addBook(payLoad);
        const bookId = book._id;
        const flagResolut = await libraryRepository.addBook(bookId, authorId);

        if (!flagResolut) {
            return res.status(400).json({
                message: 'Ошибка при попытке добавить книгу в библиотеку'
            });
        }

        return res.status(200).json({ message: 'Успешно' });
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
        const isDeleteInBooks = await booksRepository.deleteBook(bookId);
        if (!isDeleteInBooks) {
            return res.status(400).json({
                message: 'Не удалось удалить книгу из бд книг'
            });
        }

        const isDeleteInLib = await libraryRepository.deleteBookById(bookId);
        if (!isDeleteInLib) {
            return res
                .status(400)
                .json({ message: 'Не удалось удалить книгу из библиотеки' });
        }
        // const authorId = book.getAuthorID();
        // const flag = await libraryDB.deleteBy2ID(bookId, authorId);
        // if (!flag) {
        //     res.status(400).json({
        //         message: 'Не удалось удалить книгу из библиотеки'
        //     });
        // }
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
