import { authorToBooksRepository } from '../repositories/authorToBooksRepository.js';
import { ExceptionForHandler } from '../exception/error.js';
import { exceptionGenerator } from '../exception/exceptionGenerator.js';
import { booksRepository } from '../repositories/booksRepository.js';
import { usersRepository } from '../repositories/usersRepository.js';
import { Genres } from '../enums/genres.enum.js';
import { Role } from '../enums/role.enum.js';


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
        if (!books)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Ошибка запроса к репозиторию книг'
            });

        res.status(200).json({ message: 'Успешно', books });
    }

    /**
     * поиск книги по id
     * @returns ответ {message, book(payload)}
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
     * @returns ответ {message, books(payload)}
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
     * Создает книгу в репозиотрии библиотеке и книг
     * @returns ответ {message}
     */
    async addNew (req, res) {
        exceptionGenerator.testByValidator(req);

        const { name, countPages, genre, authorId } = req.body;

        let goodGenre = false;
        for (let key in Genres) {
            if (Genres[key] === genre) goodGenre = true;
        }
        if (!goodGenre)
            throw new ExceptionForHandler({
                status: 404,
                message: 'Указанный жанр отсутствует в системе'
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
