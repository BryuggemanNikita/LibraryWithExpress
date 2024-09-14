import express from 'express';
import { AuthorService } from '../services/author.service.js';
import { libraryService } from './library.endpoint.js';
import { bookService } from './book.endpoint.js';
import { IsEmptyStr } from '../stringTests/IsEmpty.js';
import { IsOnlyWords } from '../stringTests/IsOnlyWords.js';

export const authorService = new AuthorService();
export const authorEndpoint = express.Router();

authorEndpoint.get('/getAllAuthors', async (request, response) => {
    const authors = await authorService.getAuthors();
    const len = authors.length;
    if (!len) {
        response.status(404).send(authors);
        return;
    }
    response.send(authors);
});

authorEndpoint.get('/getByID/:id', async (request, response) => {
    const authorID = parseInt(request.params.id);
    let author = await authorService.getAuthorByID(authorID);
    if (!author) {
        response.sendStatus(404);
        return;
    }
    response.send(author);
});

authorEndpoint.get('/getByReg', async (request, response) => {
    const payload = request.query;
    const fullname = payload.Fullname;
    if (IsEmptyStr(fullname)) {
        response.sendStatus(400);
        return;
    }
    const res = await authorService.getAuthorsByRegExp(fullname);
    if (!res) {
        response.status(404).send(res);
        return;
    }
    response.send(res);
});

authorEndpoint.post('/addAuthor', async (request, response) => {
    const name = request.body.name;
    const surname = request.body.surname;

    if (!name || !surname) {
        response.sendStatus(400);
        return;
    }
    if (IsEmptyStr([name, surname])) {
        response.sendStatus(400);
        return;
    }
    if (!IsOnlyWords([name, surname])) {
        response.sendStatus(400);
        return;
    }

    const flag = await authorService.addNewAuthor(name, surname);
    if (!flag) {
        response.sendStatus(400);
        return;
    }
    response.sendStatus(200);
});

authorEndpoint.put('/changeAuthorInfoByID/:id', async (request, response) => {
    const authorID = parseInt(request.params.id);
    const name = request.body.name;
    const surname = request.body.surname;

    const isHas = await authorService.hasByAuthorID(authorID);
    if (!isHas) {
        response.sendStatus(404);
        return;
    }
    if (!name || !surname) {
        response.sendStatus(404);
        return;
    }
    if (!IsOnlyWords([name, surname])) {
        response.sendStatus(400);
        return;
    }
    if (IsEmptyStr([name, surname])) {
        response.sendStatus(400);
        return;
    }

    const req = await authorService.updateAuthorInfoByID(
        authorID,
        name,
        surname
    );
    if (!req) {
        response.sendStatus(404);
        return;
    }
    response.sendStatus(200);
});

authorEndpoint.delete('/deleteAuthorByID/:id', async (request, response) => {
    const authorID = parseInt(request.params.id);
    const req = await authorService.deleteAuthorByID(authorID);

    if (!req) {
        response.sendStatus(404);
        return;
    }

    const bookIDs = await libraryService.deleteAuthorLibrary(authorID);
    bookIDs.forEach(async e => await bookService.deleteByID(e));

    response.sendStatus(200);
});

authorEndpoint.get('/getArrayByFilter', (request, response) => {
    const name = request.query.name;
    const surname = request.query.surname;
    console.log(IsEmptyStr(String(name)));
    console.log(surname);
    response.sendStatus(200);
});
