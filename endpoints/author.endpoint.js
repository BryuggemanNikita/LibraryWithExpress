import express from 'express';
import { AuthorService } from '../services/author.service.js';

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
    if (!isNaN(name || surname)) {
        response.sendStatus(203);
        return;
    }
    authorServise.addNewAuthor(name, surname);
    response.sendStatus(200);
});
