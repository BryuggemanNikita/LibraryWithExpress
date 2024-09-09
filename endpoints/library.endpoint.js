import express from 'express';
import { LibraryService } from '../services/library.service.js';

export const libraryService = new LibraryService();
export const libraryEndoint = express.Router();

libraryEndoint.get('/getAll', async (request, response) => {
    const lib = await libraryService.getAll();
    response.send(Object.fromEntries(lib));
});

libraryEndoint.get('/getByAuthorID/:id', async (request, response) => {
    const authorID = parseInt(request.params.id);
    const authorLib = await libraryService.getByID(authorID);
    const res = {};
    res[authorID] = authorLib;
    response.send(res);
});
