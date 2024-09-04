import express from 'express';
import { Genres } from '../enums/genres.enum.js';

export const genreEndpoint = express.Router();

genreEndpoint.get('/getAll', (request, response) => {
    response.send(Genres);
});
