import { authorService } from '../services/author.service.js';
import { check } from 'express-validator';
import express from 'express';

export const authorEndpoint = express.Router();

authorEndpoint.get('/getAllAuthors', (req, res, next) => {
    authorService.getAllAuthors(req, res).catch(next);
});

authorEndpoint.get(
    '/getByID',
    [check('id', 'не указан id').notEmpty()],
    (req, res, next) => {
        authorService.getAuthorByID(req, res).catch(next);
    }
);

authorEndpoint.get(
    '/getByReg',
    [check('findName', 'Имя не должно быть пустым').notEmpty()],
    (req, res, next) => {
        authorService.getAuthorsByRegExp(req, res).catch(next);
    }
);
