import express from 'express';
import { BookService } from '../services/books.service.js';
import { authorService } from './author.endpoint.js';
import { libraryService } from './library.endpoint.js';
import { IsEmptyStr } from '../stringTests/IsEmpty.js';
import { Genres } from '../enums/genres.enum.js';
import { roleMiddleware } from '../middleware/auth.middleware.js';
import { Role } from '../enums/role.enum.js';

export const bookService = new BookService();
export const bookEndpoint = express.Router();

bookEndpoint.get('/getAllBooks', async (request, response) => {
    const books = await bookService.getAll();
    const len = books.length;
    if (!len) {
        response.status(404).send(books);
        return;
    }
    response.send(books);
});

bookEndpoint.get('/getByID/:id', async (request, response) => {
    const bookID = parseInt(request.params.id);
    const book = await bookService.getByID(bookID);
    if (!book) {
        response.sendStatus(404);
        return;
    }
    response.send(book);
});

bookEndpoint.get('/getByReg', async (request, response) => {
    const payLoad = request.query;
    const name = payLoad.name;
    if(IsEmptyStr(name)){
        response.sendStatus(404);
        return;
    }
    const res = await bookService.getByBooksByRegExp(name);
    const resLen = res.length;
    if (!resLen) {
        response.status(404).send(res);
        return;
    }
    response.send(res);
});

bookEndpoint.post('/addBook', roleMiddleware([Role.ADMIN]),async (request, response) => {
    const name = request.body.name;
    const genre = Genres[parseInt(request.body.genre)];
    const countPages = parseInt(request.body.countPages);
    const authorID = parseInt(request.body.authorID);

    if (!Number.isInteger(countPages) || !Number.isInteger(authorID)) {
        response.sendStatus(400);
        return;
    }
    if (isNaN(countPages) || isNaN(authorID) || !name || !genre) {
        response.sendStatus(400);
        return;
    }
    const isHas = await authorService.hasByAuthorID(authorID);
    if (!isHas) {
        response.sendStatus(404);
        return;
    }
    if (IsEmptyStr(String(name))) {
        response.sendStatus(400);
        return;
    }
    if (countPages <= 0) {
        response.sendStatus(400);
        return;
    }

    const book = await bookService.addNew(name, countPages, genre, authorID);
    await libraryService.addBook(book, authorID);
    response.sendStatus(200);
});

bookEndpoint.put('/changeBookInfoByID/:id', roleMiddleware([Role.ADMIN, Role.AUTHOR]), async (request, response) => {
    const bookID = parseInt(request.params.id);
    const payload = request.query;
    let newName = payload.name;
    let newCountPages = parseInt(payload.countPages);
    let newGenre = Genres[parseInt(payload.genre)];

    newName = !newName || IsEmptyStr(String(newName)) ? null : newName;
    newGenre = !newGenre ? null : newGenre;
    newCountPages =
        newCountPages <= 0 ||
        isNaN(newCountPages) ||
        !Number.isInteger(newCountPages)
            ? null
            : newCountPages;

    const flag = await bookService.updateBookInfoByID(
        bookID,
        newName,
        newCountPages,
        newGenre
    );
    if (!flag) {
        response.sendStatus(404);
        return;
    }
    response.sendStatus(200);
});

bookEndpoint.delete('/deleteBookByID/:id', roleMiddleware([Role.ADMIN]), async (request, response) => {
    const bookID = parseInt(request.params.id);
    const book = await bookService.deleteByID(bookID);
    if (!book) {
        response.sendStatus(404);
        return;
    }
    const authorID = book.getAuthorID();
    await libraryService.deleteBy2ID(authorID, bookID);
    response.sendStatus(200);
});
