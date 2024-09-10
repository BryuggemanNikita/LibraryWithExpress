import express from 'express';
import { AuthorService } from '../services/author.service.js';
import { libraryService } from './library.endpoint.js';
import { bookService } from './book.endpoint.js';
import { IsEmptyStr } from '../stringTests/IsEmpty.js';
import { IsOnlyWords } from '../stringTests/IsOnlyWords.js';

export const authorService = new AuthorService();
export const authorEndpoint = express.Router();

authorEndpoint.get('/getAllAuthors', (request, response) => {
    const authors = authorService.getAuthors();
    response.send(authors);
});

authorEndpoint.get('/getByID/:id', (request, response) => {
    const authorID = parseInt(request.params.id);
    let author = authorService.getAuthorByID(authorID);
    if (!author) {
        response.sendStatus(404);
        return;
    }
    response.send(author);
});

authorEndpoint.get('/getByReg', (request, response) => {
    const payload = request.query;
    const fullname = payload.Fullname;
    const res = authorService.getAuthorsByRegExp(fullname);

    if (res.length == 0) {
        response.status(404).send(res);
        return;
    }

    response.send(res);
});

authorEndpoint.post('/addAuthor', (request, response) => {
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

    const flag = authorService.addNewAuthor(name, surname); 
    if (!flag) {
        response.sendStatus(400);
        return;
    }
    response.sendStatus(200);
});

authorEndpoint.put('/changeAuthorInfoByID/:id', (request, response) => {
    const authorID = parseInt(request.params.id);
    const name = request.body.name;
    const surname = request.body.surname;

    if (!authorService.hasByAuthorID(authorID)) {
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

    const req = authorService.updateAuthorInfoByID(authorID, name, surname);
    if (!req) {
        response.sendStatus(404);
        return;
    }
    response.sendStatus(200);
});

authorEndpoint.delete('/deleteAuthorByID/:id', (request, response) => {
    const authorID = parseInt(request.params.id);
    const req = authorService.deleteAuthorByID(authorID);

    if (!req) {
        response.sendStatus(404);
        return;
    }

    const bookIDs = libraryService.deleteAuthorLibrary(authorID);
    bookIDs.forEach(e => bookService.deleteByID(e));

    response.sendStatus(200);
});

authorEndpoint.get('/getArrayByFilter', (request, response) => {
    const name = request.query.name;
    const surname = request.query.surname;
    console.log(IsEmptyStr(String(name)));
    console.log(surname);
    response.sendStatus(200);
});
