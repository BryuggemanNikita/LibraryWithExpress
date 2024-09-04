import express from 'express';
import { AuthorService } from '../services/author.service.js';
import { IsEmpty } from '../stringTests/IsEmpty.js';
import { IsOnlyWords } from '../stringTests/IsOnlyWords.js';

export const authorServise = new AuthorService();
export const authorEndpoint = express.Router();

authorEndpoint.get('/getAllAuthors', (request, response) => {
    const authors = authorServise.getAuthors();
    response.send(JSON.parse(JSON.stringify(authors)));
});

authorEndpoint.get('/getByID/:id', (request, response) => {
    const authorID = parseInt(request.params.id);
    let author = authorServise.getAuthorByID(authorID);
    if (!author) {
        response.sendStatus(404);
        return;
    }
    response.send(author);
});

authorEndpoint.post('/addAuthor', (request, response) => {
    const name = request.body.name;
    const surname = request.body.surname;

    if (!name || !surname) {
        response.sendStatus(400);
        return;
    }
    if (IsEmpty([name, surname])) {
        response.sendStatus(400);
        return;
    }
    if (!IsOnlyWords([name, surname])) {
        response.sendStatus(400);
        return;
    }

    if (!authorServise.addNewAuthor(name, surname)) {
        response.sendStatus(400);
        return;
    }
    response.sendStatus(200);
});

authorEndpoint.put('/changeAuthorInfoByID/:id', (request, response) => {
    const authorID = parseInt(request.params.id);
    const name = request.body.name;
    const surname = request.body.surname;

    if (!IsOnlyWords([name, surname])) {
        response.sendStatus(400);
        return;
    }
    if (IsEmpty([name, surname])) {
        response.sendStatus(400);
        return;
    }

    const req = authorServise.updateAuthorInfoByID(authorID, name, surname);
    if (!req) {
        response.sendStatus(404);
        return;
    }
    response.sendStatus(200);
});

authorEndpoint.delete('/deleteAuthorByID/:id', (request, response) => {
    const authorID = parseInt(request.params.id);
    const req = authorServise.deleteAuthorByID(authorID);
    if (!req) {
        response.sendStatus(404);
        return;
    }
    response.sendStatus(200);
});

authorEndpoint.get('/getArrayByFilter', (request, response) => {
    const name = request.query.name;
    const surname = request.query.surname;
    console.log(IsEmpty(String(name)));
    console.log(surname);
    response.sendStatus(200);
});
