import { libraryService } from '../services/library.service.js';
import express from 'express';

export const libraryEndoint = express.Router();

libraryEndoint.get('/getAll', (req, res, next) => {
    libraryService.getAll(req, res).catch(next);
});

libraryEndoint.get('/getByAuthorID', (req, res, next) => {
    libraryService.getByID(req, res).catch(next);
});
