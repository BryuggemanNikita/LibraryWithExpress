import express from 'express';
import env from 'dotenv';
import { authorEndpoint } from './endpoints/author.endpoint.js';
import { bookEndpoint } from './endpoints/book.endpoint.js';
import { genreEndpoint } from './endpoints/genres.endpoint.js';
import { libraryEndoint } from './endpoints/library.endpoint.js';

const app = express();
env.config();
app.use(express.json());

app.use('/authors', authorEndpoint);
app.use('/books', bookEndpoint);
app.use('/genres', genreEndpoint);
app.use('/library', libraryEndoint);

app.get('/helth', (response, require) => {
    require.send(process.env.HELTH_STATUS);
});

app.listen(process.env.PORT || 80, () => {
    console.log(`Server init in port ${process.env.PORT}`);
});
