import express from 'express';
import { check } from 'express-validator';
import { AuthService } from '../services/auth.service.js';
import { roleMiddleware } from '../middleware/auth.middleware.js';
import { Role } from '../enums/role.enum.js';

export const authEndpoint = express.Router();
const authService = new AuthService();

authEndpoint.post(
    '/registration',
    [
        check('username', 'Имя не должно быть пустым').notEmpty(),
        check(
            'password',
            'Пароль должен содержать не менее 8 символов'
        ).isLength({ min: 8 }),
        check('email', 'Неверно указана почта').isEmail()
    ],
    authService.registration
);

authEndpoint.post(
    '/login',
    [
        check(
            'password',
            'Пароль должен содержать не менее 8 символов'
        ).isLength({ min: 8 })
    ],
    authService.login
);

authEndpoint.get('/getUsers', roleMiddleware([Role.ADMIN]), authService.getAllUsers);
