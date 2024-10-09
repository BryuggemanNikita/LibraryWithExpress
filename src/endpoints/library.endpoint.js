import express from 'express';
import { libraryService } from '../services/library.service.js';

export const libraryEndoint = express.Router();

libraryEndoint.get('/getAll', libraryService.getAll);

libraryEndoint.get('/getByAuthorID', libraryService.getByID);
