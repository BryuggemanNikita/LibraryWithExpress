import { libraryRepository } from '../repositories/libraryRepository.js';

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
        const library = await libraryRepository.getLibrary();
        if (!library.length) {
            return res
                .status(404)
                .json({ message: 'Библиотека отсутствует', library });
        }
        res.status(200).json({ message: 'Успешно', library });
    }

    /**
     * Поиск библиотеки автора по id
     * @returns результат поиска
     */
    async getByID (req, res) {
        const { id } = req.body;

        const authorLib = await libraryRepository.getAuthorLibraryById(id);

        if (!authorLib.length) {
            return res
                .status(400)
                .json({ message: 'Автор не найден', authorLib: [] });
        }
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
