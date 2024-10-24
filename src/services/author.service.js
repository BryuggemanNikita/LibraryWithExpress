import { handlingErrors } from '../exception/exceptionValidator.js';
import { validationResult } from 'express-validator';
import { authorsRepository } from '../repositories/usersRepository.js';

/**
 * Сервер взаимодействия с authors
 * @method getAllAuthors (req, res) : {message, authors}
 * @method getAuthorByID (req, res) : {message, author}
 * @method getAuthorsByRegExp (req, res) : {message, author}
 */
class AuthorService {
    /**
     * Поиск всех авторов(payload)
     * @returns ответ {message, authors(payload)}
     */
    async getAllAuthors (req, res) {
        const authors = await authorsRepository.getAuthors();
        await handlingErrors.responseError(
            !authors,
            400,
            'Ошибка запроса к репозиторию авторов',
            res
        );

        return res.status(200).json({ message: 'Успешно', authors });
    }

    /**
     * Поиск автора по id
     * @returns ответ {message, author(payload)}
     */
    async getAuthorByID (req, res) {
        const errors = validationResult(req);
        await handlingErrors.errorsHendlingForValidator(
            errors,
            'Ошибка запроса',
            res
        );

        const { id } = req.body;

        let author = await authorsRepository.getById(id);
        await handlingErrors.responseError(
            !author,
            404,
            'Автор не найден',
            res
        );

        return res.status(200).json({ message: 'Успешно', author });
    }

    /**
     * Поиск авторов по имени
     * @returns ответ {status, authors(payload)}
     */
    async getAuthorsByRegExp (req, res) {
        const errors = validationResult(req);
        await handlingErrors.errorsHendlingForValidator(
            errors,
            'Ошибка поиска',
            res
        );

        const { findName } = req.body;

        const authors = await authorsRepository.getByRegular(findName);
        await handlingErrors.responseError(
            !authors,
            400,
            'Ошибка запроса к репозиторию авторов',
            res
        );

        return res.status(200).json({ message: 'Успешно', authors });
    }
}

/**
 * Экземпляр класса
 * @method getAllAuthors (req, res) : {message, authors}
 * @method getAuthorByID (req, res) : {message, author}
 * @method getAuthorsByRegExp (req, res) : {message, author}
 */
export const authorService = new AuthorService();
