import { authorEndpoint } from './endpoints/author.endpoint.js';
import { libraryEndoint } from './endpoints/library.endpoint.js';
import { genreEndpoint } from './endpoints/genres.endpoint.js';
import { authEndpoint } from './endpoints/auth.endpoint.js';
import { userEndpoint } from './endpoints/user.endpoint.js';
import { bookEndpoint } from './endpoints/book.endpoint.js';
import express from 'express';
import env from 'dotenv';

const app = express();
env.config();
app.use(express.json());
app.use((req, res, next) => {
    console.log(`request - ${req.method}, url - ${req.url}`);
    next();
});

app.use('/auth', authEndpoint);
app.use('/user', userEndpoint);
app.use('/authors', authorEndpoint);
app.use('/books', bookEndpoint);
app.use('/genres', genreEndpoint);
app.use('/library', libraryEndoint);

app.listen(process.env.PORT, () => {
    console.log(`Server init in port ${process.env.PORT}`);
});
