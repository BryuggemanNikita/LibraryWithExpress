import express from 'express';
import { AuthorService } from '../services/author.service.js';
import { IsOnlyWords } from '../stringTests/IsOnlyWords.js';
import { IsEmpty } from '../stringTests/IsEmpty.js';

const authorServise = new AuthorService();
export const authorEndpoint = express.Router();

authorEndpoint.get('', (request, response) => {
    response.send(JSON.parse(JSON.stringify(authorServise.getAuthors())));
});

authorEndpoint.get('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    let author = authorServise.getAuthorByID(id);
    if (author === null) {
        response.sendStatus(404);
        return;
    }
    response.send(author);
});

authorEndpoint.post('', (request, response) => {
    const name = request.body.name;
    const surname = request.body.surname;

    if (!IsOnlyWords(name) || !IsOnlyWords(surname)) {
        response.sendStatus(400);
        return;
    }
    if (IsEmpty(name) || IsEmpty(surname)) {
        response.sendStatus(400);
        return;
    }

    authorServise.addNewAuthor(name, surname);
    response.sendStatus(200);
});

authorEndpoint.put('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const name = request.body.name;
    const surname = request.body.surname;

    if (!IsOnlyWords(name) || !IsOnlyWords(surname)) {
        response.sendStatus(400);
        return;
    }
    if (IsEmpty(name) || IsEmpty(surname)) {
        response.sendStatus(400);
        return;
    }
    
    const req = authorServise.updateAuthorInfoByID(id, name, surname);
    if (!req) {
        response.sendStatus(404);
        return;
    }
    response.sendStatus(200);
});

authorEndpoint.delete('/:id', (request, response) => {
    const id = parseInt(request.params.id);
    const req = authorServise.deleteAuthorByID(id);
    if (!req) {
        response.sendStatus(404);
        return;
    }
    response.sendStatus(200);
});
