import { Genres } from '../enums/genres.enum.js';
import express from 'express';

export const genreEndpoint = express.Router();

genreEndpoint.get('/getAll', (request, response) => {
    response.send(Genres);
});
