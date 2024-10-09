import express from 'express';
import { roleMiddleware } from '../middleware/auth.middleware.js';
import { Role } from '../enums/role.enum.js';
import { check } from 'express-validator';
import { bookService } from '../services/books.service.js';

export const bookEndpoint = express.Router();

bookEndpoint.get('/getAllBooks', bookService.getAll);

bookEndpoint.get('/getByID', bookService.getByID);

bookEndpoint.get(
    '/getByReg',
    [check('findName', 'подстрока не должна быть пустой').notEmpty()],
    bookService.getByRegExp
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
    bookService.addNew
);

bookEndpoint.delete(
    '/deleteBookByID',
    [check('bookId', 'Неверно указан id книги').notEmpty()],
    roleMiddleware([Role.ADMIN]),
    bookService.deleteByID
);




// bookEndpoint.put(
//     '/changeBookInfoByID/:id',
//     roleMiddleware([Role.ADMIN, Role.AUTHOR]),
//     async (request, response) => {
//         const bookID = parseInt(request.params.id);
//         const payload = request.query;
//         let newName = payload.name;
//         let newCountPages = parseInt(payload.countPages);
//         let newGenre = Genres[parseInt(payload.genre)];

//         newName = !newName || IsEmptyStr(String(newName)) ? null : newName;
//         newGenre = !newGenre ? null : newGenre;
//         newCountPages =
//             newCountPages <= 0 ||
//             isNaN(newCountPages) ||
//             !Number.isInteger(newCountPages)
//                 ? null
//                 : newCountPages;

//         const userInSys = request.user;
//         if (!userInSys.roles.includes(Role.ADMIN)) {
//             const userId = userInSys.id;
//             const book = await bookService.getByID(bookID);
//             const authorId = book.getAuthorID();
//             if (userId !== authorId) {
//                 return response.status(400).json({
//                     message: 'Вы не можете изменять информацию о чужой книге'
//                 });
//             }
//         }
//         const flag = await bookService.updateBookInfoByID(
//             bookID,
//             newName,
//             newCountPages,
//             newGenre
//         );
//         if (!flag) {
//             response.sendStatus(404);
//             return;
//         }
//         response.sendStatus(200);
//     }
// );

// /**
//  * @param {*} name - Название книги
//  * @param {*} genre - Жанр книги
//  * @param {*} countPages - Количество страниц
//  * @param {*} authorId - Id автора
//  * @returns массив из ошибок в виде объектов
//  */
// const getErrorsInPayload = async (name, genre, countPages, authorId) => {
//     const errors = [];

//     if (!Number.isInteger(authorId) || isNaN(authorId)) {
//         addError(errors, 400, 'Неверно указаны данные об авторе');
//     }
//     const isHas = await authorsFilter.getByID(authorId);
//     if (!isHas) {
//         addError(errors, 400, 'Отсутствует указанный автор');
//     }

//     if (!genre) {
//         addError(errors, 400, 'Неверные данные о жанре');
//     }

//     if (IsEmptyStr(String(name)) || !name) {
//         addError(errors, 400, 'Имя указано неверно');
//     }
//     if (countPages <= 0 || !Number.isInteger(countPages) || isNaN(countPages)) {
//         addError(errors, 400, 'Количество страниц указано неверно');
//     }

//     return errors;
// };

// const addError = (errorsArray, errorNumb, errorMessage) => {
//     errorsArray.push({ error: errorNumb, message: errorMessage });
// };
