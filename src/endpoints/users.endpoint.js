import express from 'express';

export const userRouter = express.Router();

userRouter.post('/signup', (req, res) => {
    res.send('song up');
});

userRouter.post('signin', (req, res) => {
    res.send('sing in');
});