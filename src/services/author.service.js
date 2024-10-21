import { authorsRepository } from '../repositories/authorsRepository.js';
import { validationResult } from 'express-validator';

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
        if (!authors.length) {
            return res
                .status(404)
                .json({ messgae: 'Авторы не найдены', authors });
        }
        return res.status(200).json({ message: 'Успешно', authors });
    }

    /**
     * Поиск автора по id
     * @returns ответ {message, author(payload)}
     */
    async getAuthorByID (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Ошибка поиска', errors });
        }
        const { id } = req.body;

        let author = await authorsRepository.getByID(id);
        if (!author) {
            return res.status(404).json({ message: 'Автор не найден' });
        }
        return res.status(200).json({ message: 'Успешно', author });
    }

    /**
     * Поиск авторов по имени
     * @returns ответ {status, authors(payload)}
     */
    async getAuthorsByRegExp (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ message: 'Ошибка поиска', errors });
        }
        const { findName } = req.body;
        const authors = await authorsRepository.getByRegExp(findName);
        console.log(authors);

        if (!authors.length) {
            return res
                .status(404)
                .json({ message: 'Авторы не найдены', authors });
        }
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
