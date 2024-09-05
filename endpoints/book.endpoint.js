import express from 'express';
import { BookService } from '../services/books.service.js';
import { IsEmptyStr } from '../stringTests/IsEmpty.js';
import { Genres } from '../enums/genres.enum.js';
import { libraryService } from './library.endpoint.js';

const bookService = new BookService();
export const bookEndpoint = express.Router();

bookEndpoint.get('/getAllBooks', (request, response) => {
    const books = bookService.getAll();
    response.send(JSON.parse(JSON.stringify(books)));
});

bookEndpoint.get('/getByID/:id', (request, response) => {
    const bookID = parseInt(request.params.id);
    const book = bookService.getByID(bookID);
    if (!book) {
        response.sendStatus(404);
        return;
    }
    response.send(book);
});

bookEndpoint.get('/getByReg', (request, response) => {
    const payLoad = request.query;
    const name = payLoad.name;

    const res = bookService.getByBooksByRegExp(name);

    if (res.length == 0) {
        response.sendStatus(404);
        return;
    }
    response.send(JSON.parse(JSON.stringify(res)));
});

bookEndpoint.post('/addBook', (request, response) => {
    const name = request.body.name;
    const genre = Genres[parseInt(request.body.genre)];
    const countPages = parseInt(request.body.countPages);
    const authorID = parseInt(request.body.authorID);

    if (
        countPages < 0 ||
        isNaN(countPages) ||
        isNaN(authorID) ||
        !name ||
        !genre ||
        IsEmptyStr([String(name), String(countPages)])
    ) {
        response.sendStatus(400);
        return;
    }
    try {
        const book = bookService.addNew(name, countPages, genre, authorID);
        libraryService.addBook(book, authorID);
        response.sendStatus(200);
    } catch (e) {
        response.sendStatus(404);
        console.log(e);
    }
});

bookEndpoint.put('/changeBookInfoByID/:id', (request, response) => {
    const bookID = parseInt(request.params.id);
    const payload = request.query;
    let newName = payload.name;
    let newCountPages = payload.countPages;
    let newGenre = Genres[payload.genre];
    newName = IsEmptyStr(String(newName)) ? null : newName;
    newGenre = IsEmptyStr(String(newGenre) || isNaN(newGenre))
        ? null
        : newGenre;
    newCountPages =
        newCountPages < 0 || IsEmptyStr(String(newCountPages))
            ? null
            : parseInt(newCountPages);

    const flag = bookService.updateBookInfoByID(
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

bookEndpoint.delete('/deleteBookByID/:id', (request, response) => {
    const bookID = parseInt(request.params.id);
    bookService.deleteByID(bookID);
    response.sendStatus(200);
});
