import { roleMiddleware } from '../middleware/auth.middleware.js';
import { authService } from '../services/auth.service.js';
import { check } from 'express-validator';
import { Role } from '../enums/role.enum.js';
import express from 'express';

export const authEndpoint = express.Router();

authEndpoint.post(
    '/registration',
    [
        check('name', 'Имя не должно быть пустым').notEmpty(),
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

authEndpoint.get(
    '/getUsers',
    roleMiddleware([Role.ADMIN]),
    authService.getAllUsers
);
