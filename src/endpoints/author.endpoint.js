import { authorService } from '../services/author.service.js';
import { check } from 'express-validator';
import express from 'express';

export const authorEndpoint = express.Router();

authorEndpoint.get('/getAllAuthors', authorService.getAllAuthors);

authorEndpoint.get(
    '/getByID',
    [check('id', 'не указан id').notEmpty()],
    authorService.getAuthorByID
);

authorEndpoint.get(
    '/getByReg',
    [check('findName', 'Имя не должно быть пустым').notEmpty()],
    authorService.getAuthorsByRegExp
);
