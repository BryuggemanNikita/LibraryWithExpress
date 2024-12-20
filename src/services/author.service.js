import { authorsRepository, usersRepository } from '../repositories/usersRepository.js';
import { ExceptionForHandler } from '../common/exception/error.js';
import { exceptionGenerator } from '../common/exception/exceptionGenerator.js';
import { Role } from '../enums/role.enum.js';

/**
 * Сервер взаимодействия с authors
 * все методы являются асинхронными
 * @method getAllAuthors (req, res) : {message, authors:user[]} | ExceptionForHandler
 * @method getAuthorByID (req, res) : {message, author} | ExceptionForHandler
 * @method getAuthorsByRegExp (req, res) : {message, author} | ExceptionForHandler
 */
class AuthorService {
    /**
     * Поиск всех авторов(payload)
     * @returns ответ {message, authors(payload)}
     */
    async getAllAuthors (req, res) {
        const authors = await usersRepository.getAllByRole(Role.AUTHOR);
        if (!authors)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Ошибка запроса к репозиторию авторов'
            });
        return res.status(200).json({ message: 'Успешно', authors });
    }

    /**
     * Поиск автора по id
     * @returns ответ {message, author(payload)}
     */
    async getAuthorByID (req, res) {
        exceptionGenerator.testByValidator(req);

        const { id } = req.body;

        let author = await authorsRepository.getById(id);
        if (!author[0])
            throw new ExceptionForHandler({
                status: 404,
                message: 'Автора с данным id не существует'
            });

        return res.status(200).json({ message: 'Успешно', author });
    }

    /**
     * Поиск авторов по имени
     * @returns ответ {status, authors(payload)}
     */
    async getAuthorsByRegExp (req, res) {
        exceptionGenerator.testByValidator(req);

        const { findName } = req.body;

        const authors = await authorsRepository.getByRegular(findName);
        if (!authors)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Ошибка запроса к репозиторию авторов'
            });

        return res.status(200).json({ message: 'Успешно', authors });
    }
}

/**
 * Экзмепляр класса
 * все методы являются асинхронными
 * @method getAllAuthors (req, res) : {message, authors:user[]} | ExceptionForHandler
 * @method getAuthorByID (req, res) : {message, author} | ExceptionForHandler
 * @method getAuthorsByRegExp (req, res) : {message, author} | ExceptionForHandler
 */
export const authorService = new AuthorService();
