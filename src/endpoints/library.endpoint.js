import { libraryService } from '../services/library.service.js';
import express from 'express';

export const libraryEndoint = express.Router();

libraryEndoint.get('/getAll', libraryService.getAll);

libraryEndoint.get('/getByAuthorID', libraryService.getByID);
