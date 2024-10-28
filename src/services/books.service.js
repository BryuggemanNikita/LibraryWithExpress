import { authorToBooksRepository } from '../repositories/authorToBooksRepository.js';
import { ExceptionForHandler } from '../common/exception/error.js';
import { exceptionGenerator } from '../common/exception/exceptionGenerator.js';
import { removeEmptyValue } from '../common/anyFunction/removeEmptyValue.js';
import { booksRepository } from '../repositories/booksRepository.js';
import { usersRepository } from '../repositories/usersRepository.js';
import { valueInObject } from '../common/anyFunction/valueInObject.js';
import { Genres } from '../enums/genres.enum.js';
import { Role } from '../enums/role.enum.js';

/**
 * Сервис взаимодействия с Books
 * все методы являются асинхронными
 * @method getAll : {message, book[]} | ExceptionForHandler
 * @method getByID : {message, book} | ExceptionForHandler
 * @method getByRegExp : {message, book[]} | ExceptionForHandler
 * @method getBooksByFilter : {message, book[]} | ExceptionForHandler
 * @method addNew : {message} | ExceptionForHandler
 * @method deleteByID : {message} | ExceptionForHandler
 * @method updateBookInfo : {message} | ExceptionForHandler
 */
class BookService {
    /**
     * Поиск всех книг(payload)
     * @returns ответ {message, book[]}
     */
    async getAll (req, res) {
        const books = await booksRepository.getBooks();
        if (!books)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Ошибка запроса к репозиторию книг'
            });

        res.status(200).json({ message: 'Успешно', books });
    }

    /**
     * поиск книги по id
     * @returns ответ {message, book}
     */
    async getByID (req, res) {
        const { bookId } = req.body;
        const book = await booksRepository.getById(bookId);
        if (!book)
            throw new ExceptionForHandler({
                status: 404,
                message: 'Книга не найдена'
            });

        return res.status(200).json({ message: 'Успешно', book });
    }

    /**
     * Поиск книг по названию
     * @returns ответ {message, books[]}
     */
    async getByRegExp (req, res) {
        exceptionGenerator.testByValidator(req);

        const { findName } = req.body;
        const books = await booksRepository.getByRegExp(findName);
        if (!books)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Ошибка запроса к репозиторию книг'
            });

        res.status(200).json({ message: 'Успешно', books });
    }

    /**
     * Поиск книг по фильтру
     * @returns ответ {message, books[]}
     */
    async getBooksByFilter (req, res) {
        const { name, genre, countPages } = req.body;
        const payload = { name, genre, countPages };
        removeEmptyValue(payload);
        
        if (genre) {
            const isGoodGenre = valueInObject(genre, Genres);
            if (!isGoodGenre)
                throw new ExceptionForHandler({
                    status: 400,
                    message: 'жанр не определен'
                });
        }

        const books = await booksRepository.getBooksByFilter(payload);
        console.log(books);

        res.status(200).json({ message: 'Успешно', books });
    }

    /**
     * Создает книгу в репозиотрии библиотеке и книг
     * @returns ответ {message}
     */
    async addNew (req, res) {
        exceptionGenerator.testByValidator(req);

        const { name, countPages, genre, authorId } = req.body;

        const isGoodGenre = valueInObject(genre, Genres);
        if (!isGoodGenre)
            throw new ExceptionForHandler({
                status: 400,
                message: 'жанр не определен'
            });

        // проверка на наличие автора в системе
        const user = await usersRepository.getById(authorId);
        if (!user)
            throw new ExceptionForHandler({
                status: 404,
                message: 'Пользователя нет в системе'
            });

        const hasAuthorRole = user.roles.includes(Role.AUTHOR);
        if (!hasAuthorRole)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Пользователь не является автором'
            });

        const payLoad = { name, countPages, genre };
        const book = await booksRepository.addBook(payLoad);
        const bookId = book._id;
        const flagResolut = await authorToBooksRepository.addBook(
            authorId,
            bookId
        );
        if (!flagResolut)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Ошибка при попытке добавить книгу в библиотеку'
            });

        return res.status(200).json({ message: 'Успешно' });
    }

    /**
     * Удаляет книгу из репозиотрия библиотеки и книг
     * @returns ответ {message}
     */
    async deleteByID (req, res) {
        exceptionGenerator.testByValidator(req);

        const { bookId } = req.body;

        const isDeleteInBooks = await booksRepository.deleteBook(bookId);
        if (!isDeleteInBooks)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Не удалось удалить книгу из бд книг'
            });

        const isDeleteInLib = await authorToBooksRepository.deleteBookById(
            bookId
        );
        if (!isDeleteInLib)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Не удалось удалить книгу из бд библиотеки'
            });

        res.status(200).json({ message: 'Успешно' });
    }

    /**
     * Обновление информации о книге
     * @returns ответ {message}
     */
    async updateBookInfo (req, res) {
        exceptionGenerator.testByValidator(req);

        const { bookId, name, countPages, genre } = req.body;
        const payLoad = { name, countPages, genre };
        removeEmptyValue(payLoad);

        if (genre) {
            const isGoodGenre = valueInObject(genre, Genres);
            if (!isGoodGenre)
                throw new ExceptionForHandler({
                    status: 400,
                    message: 'жанр не определен'
                });
        }

        const book = await booksRepository.getById(bookId);
        if (!book)
            throw new ExceptionForHandler({
                message: 'Книга не найдена',
                status: 404
            });

        await booksRepository.updateBookInfo(bookId, payLoad);

        res.status(200).json({ message: 'успешно' });
    }
}

/**
 * Экземпляр класса BookService
 * все методы являются асинхронными
 * @method getAll : {message, book[]} | ExceptionForHandler
 * @method getByID : {message, book} | ExceptionForHandler
 * @method getByRegExp : {message, book[]} | ExceptionForHandler
 * @method getBooksByFilter : {message, book[]} | ExceptionForHandler
 * @method addNew : {message} | ExceptionForHandler
 * @method deleteByID : {message} | ExceptionForHandler
 * @method updateBookInfo : {message} | ExceptionForHandler
 */
export const bookService = new BookService();
