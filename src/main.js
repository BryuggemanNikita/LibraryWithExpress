import express from 'express';
import env from 'dotenv';
import { authorEndpoint } from './endpoints/author.endpoint.js';
import { bookEndpoint } from './endpoints/book.endpoint.js';
import { genreEndpoint } from './endpoints/genres.endpoint.js';
import { libraryEndoint } from './endpoints/library.endpoint.js';
import { userRouter } from './endpoints/users.endpoint.js';

const app = express();
env.config();
app.use(express.json());

app.use((req, res, next) => {
    console.log(`request - ${req.method}, url - ${req.url}`);
    // next();
});

app.use('/users', userRouter);

app.use('/authors', authorEndpoint);
app.use('/books', bookEndpoint);
app.use('/genres', genreEndpoint);
app.use('/library', libraryEndoint);

app.listen(process.env.PORT, () => {
    console.log(`Server init in port ${process.env.PORT}`);
});

import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'

const password = '12340005';
const hashing = bcrypt.hashSync(password, 7);

// const user = {
//     name:'Nastya',
//     email:'nsty@gmail.com'
// }
// const token = jwt.sign(user, 'secret');
// console.log(jwt.verify(token, 'secret'));


const flag = bcrypt.compareSync(password, hashing)
console.log(flag);

import { User } from './classes/User.js';

const Role = {
    ADMIN:'ADMIN',
    USER:'USER'
}

const user = new User('Nastya', 'aboba@mail.ru', hashing, Role.ADMIN)

console.log(user.getName());
console.log(user.getEmail());
console.log(user.getPassword());
console.log(user.getRole());
