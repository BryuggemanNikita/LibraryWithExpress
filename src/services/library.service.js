import { authorToBooksRepository } from '../repositories/authorToBooksRepository.js';
import { ExceptionForHandler } from '../exception/error.js';
import { authorsRepository } from '../repositories/usersRepository.js';


/**
 * Сервер взаимодействия с Library
 * @method getAll (req, res) : {message, library:Map}
 * @method getByID (req, res) : {message, authorLib[]}
 */
class LibraryService {
    /**
     * Возвращает бибиотеку
     * @returns Map() - библиотека Бд
     */
    async getAll (req, res) {
        const library = await authorToBooksRepository.getLibrary();
        if (!library)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Ошибка запроса к репозиторию автор-ннига'
            });

        res.status(200).json({ message: 'Успешно', library });
    }

    /**
     * Поиск библиотеки автора по id
     * @returns результат поиска
     */
    async getByID (req, res) {
        const { id } = req.body;
        const author = await authorsRepository.getById(id);
        if (!(author[0]))
            throw new ExceptionForHandler({
                status: 404,
                message: 'Автора с данным id не существует'
            });

        const authorLib = await authorToBooksRepository.getAuthorLibraryById(
            id
        );
        if (!authorLib)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Ошибка запроса к репозиторию автор-ннига'
            });

        const resolut = {};
        resolut[id] = [...authorLib];
        res.status(200).json({ message: 'Успешно', resolut });
    }
}

/**
 * Экземпляр класса
 * @method getAll (req, res) : {message, library:Map}
 * @method getByID (req, res) : {message, authorLib[]}
 */
export const libraryService = new LibraryService();
