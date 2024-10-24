import { authorToBooksRepository } from '../repositories/authorToBooksRepository.js';
import { handlingErrors } from '../exception/exceptionValidator.js';
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
        await handlingErrors.responseError(
            !library,
            400,
            'Ошибка запроса к репозиторию автор-ннига',
            res
        );

        res.status(200).json({ message: 'Успешно', library });
    }

    /**
     * Поиск библиотеки автора по id
     * @returns результат поиска
     */
    async getByID (req, res) {
        const { id } = req.body;
        const user = await authorsRepository.getById(id);
        await handlingErrors.responseError(
            !user,
            400,
            'Пользователь не является автором',
            res
        );
    
        const authorLib = await authorToBooksRepository.getAuthorLibraryById(
            id
        );
        await handlingErrors.responseError(
            !authorLib,
            400,
            'Ошибка запроса к репозиторию автор-ннига',
            res
        );

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
