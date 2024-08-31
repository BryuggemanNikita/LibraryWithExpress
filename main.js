import express from 'express';
import env from 'dotenv';
import { authorEndpoint } from './endpoints/author.endpoint.js';

const app = express();
env.config();
app.use(express.json());

app.use('/authors', authorEndpoint);

app.get('/helth', (response, require) => {
    require.send('Hello, i`m right');
});

app.listen(process.env.PORT, () => {
    console.log(`Server init in port ${process.env.PORT}`);
});
