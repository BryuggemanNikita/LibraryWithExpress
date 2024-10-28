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
    (req, res, next) => {
        authService.registration(req, res).catch(next);
    }
);

authEndpoint.post(
    '/login',
    [
        check('login', 'Поле login - пустое').notEmpty(),
        check(
            'password',
            'Пароль должен содержать не менее 8 символов'
        ).isLength({ min: 8 })
    ],
    (req, res, next) => {
        authService.login(req, res).catch(next);
    }
);

authEndpoint.get(
    '/getUsers',
    roleMiddleware([Role.ADMIN]),
    (req, res, next) => {
        authService.getAllUsers(req, res).catch(next);
    }
);
