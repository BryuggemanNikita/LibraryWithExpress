import express from 'express';
import { LibraryService } from '../services/Library.service.js';

export const libraryService = new LibraryService();
export const libraryEndoint = express.Router();

libraryEndoint.get('/getAll', (request, response) => {
    const lib = Object.fromEntries(libraryService.getAll());
    response.send(lib);
});

libraryEndoint.get('/getByAuthorID/:id', (request, response) => {
    const authorID = parseInt(request.params.id);
    const authorLib = libraryService.getByID(authorID);
    const res = {};
    res[authorID] = authorLib;
    response.send(res);
});
