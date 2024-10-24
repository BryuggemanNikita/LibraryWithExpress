import { authorToBooksRepository } from '../repositories/authorToBooksRepository.js';
import { handlingErrors } from '../exception/exceptionValidator.js';
import { booksRepository } from '../repositories/booksRepository.js';
import { usersRepository } from '../repositories/usersRepository.js';
import { Role } from '../enums/role.enum.js';
import { Genres } from '../enums/genres.enum.js';

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
        await handlingErrors.responseError(
            !books,
            400,
            'Ошибка запроса к репозиторию книг',
            res
        );

        res.status(200).json({ message: 'Успешно', books });
    }

    /**
     * поиск книги по id
     * @returns ответ {message, book(payload)}
     */
    async getByID (req, res) {
        const { bookId } = req.body;
        const book = await booksRepository.getById(bookId);
        await handlingErrors.responseError(!book, 404, 'Книга не найдена', res);

        return res.status(200).json({ message: 'Успешно', book });
    }

    /**
     * Поиск книг по названию
     * @returns ответ {message, books(payload)}
     */
    async getByRegExp (req, res) {
        await handlingErrors.errorsHendlingForValidator(
            req,
            res,
            'Ошибка поиска'
        );

        const { findName } = req.body;
        const books = await booksRepository.getByRegExp(findName);
        await handlingErrors.responseError(
            !books,
            400,
            'Ошибка запроса к репозиторию книг',
            res
        );

        res.status(200).json({ message: 'Успешно', books });
    }

    /**
     * Создает книгу в репозиотрии библиотеке и книг
     * @returns ответ {message}
     */
    async addNew (req, res) {
        await handlingErrors.errorsHendlingForValidator(
            req,
            res,
            'Ошибка при запросе'
        );

        const { name, countPages, genre, authorId } = req.body;

        let goodGenre = false;
        for (let key in Genres) {
            if (Genres[key] === genre) goodGenre = true;
        }
        await handlingErrors.responseError(
            !goodGenre,
            400,
            'Жанр отсутствует в системе',
            res
        );

        // проверка на наличие автора в системе
        const user = await usersRepository.getById(authorId);
        await handlingErrors.responseError(
            !user,
            400,
            'Пользователя нет в системе',
            res
        );

        const hasAuthorRole = user.roles.includes(Role.AUTHOR);
        await handlingErrors.responseError(
            !hasAuthorRole,
            400,
            'Пользователь не является автором',
            res
        );

        const payLoad = { name, countPages, genre };
        const book = await booksRepository.addBook(payLoad);
        const bookId = book._id;
        const flagResolut = await authorToBooksRepository.addBook(
            authorId,
            bookId
        );
        await handlingErrors.responseError(
            !flagResolut,
            400,
            'Ошибка при попытке добавить книгу в библиотеку',
            res
        );

        return res.status(200).json({ message: 'Успешно' });
    }

    /**
     * Удаляет книгу из репозиотрия библиотеки и книг
     * @returns ответ {message}
     */
    async deleteByID (req, res) {
        await handlingErrors.errorsHendlingForValidator(
            req,
            res,
            'Ошибка входных данных'
        );
        const { bookId } = req.body;

        const isDeleteInBooks = await booksRepository.deleteBook(bookId);
        await handlingErrors.responseError(
            !isDeleteInBooks,
            400,
            'Не удалось удалить книгу из бд книг',
            res
        );

        const isDeleteInLib = await authorToBooksRepository.deleteBookById(
            bookId
        );
        await handlingErrors.responseError(
            !isDeleteInLib,
            400,
            'Не удалось удалить книгу из бд библиотеки',
            res
        );

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
