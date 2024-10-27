import { roleMiddleware } from '../middleware/auth.middleware.js';
import { bookService } from '../services/books.service.js';
import { check } from 'express-validator';
import { Role } from '../enums/role.enum.js';
import express from 'express';

export const bookEndpoint = express.Router();

bookEndpoint.get('/getAllBooks', (req, res, next) => {
    bookService.getAll(req, res).catch(next);
});

bookEndpoint.get('/getByID', (req, res, next) => {
    bookService.getByID(req, res).catch(next);
});

bookEndpoint.get(
    '/getByReg',
    [check('findName', 'подстрока не должна быть пустой').notEmpty()],
    (req, res, next) => {
        bookService.getByRegExp(req, res).catch(next);
    }
);

bookEndpoint.post(
    '/addBook',
    [
        check('name', 'Название книги не должно быть пустым').notEmpty(),
        check('countPages', 'Вы не указали кол-во страниц').notEmpty(),
        check('genre', 'Вы не указали жанр').notEmpty(),
        check('authorId', 'Вы не указали id автора').notEmpty(),
        check('genre', 'Такого жанра нет').isLength({ max: 12 }),
        check('authorId', 'id автора указан неверно').isLength({ min: 0 })
    ],
    roleMiddleware([Role.ADMIN]),
    (req, res, next) => {
        bookService.addNew(req, res).catch(next);
    }
);

bookEndpoint.delete(
    '/deleteBookByID',
    [check('bookId', 'Неверно указан id книги').notEmpty()],
    roleMiddleware([Role.ADMIN]),
    (req, res, next) => {
        bookService.deleteByID(req, res).catch(next);
    }
);
