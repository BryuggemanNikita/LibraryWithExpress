import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from 'dotenv';
import { validationResult } from 'express-validator';
import { IsOnlyWords } from '../stringTests/IsOnlyWords.js';
import { usersDB } from '../localDataBase/users.db.js';
import { usersFilter } from '../filtersForDataBases/usersFilter.js';

env.config();

/**
 * Сервер взаимодействия с authorization
 * @method registration : {message}
 * @method login : {token}
 * @method #generateAccessToken : accessToken
 */
class AuthService {
    /**
     * Регистрация пользователя
     * @returns ответ на сервер
     */
    async registration (req, res) {
        // обработка ошибок
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({ message: 'Ошибка при регистрации', errors });
            return;
        }

        const { name, email, password } = req.body;

        // проверка name
        const isOnlyWordsInName = IsOnlyWords(name);
        if (!isOnlyWordsInName) {
            return res
                .status(400)
                .json({ messgae: 'В имени должны быть только буквы' });
        }

        // проверка на совпадения в бд
        let user = await usersFilter.getByName(name);
        if (user) {
            return res.status(400).json({
                message: 'Пользователь с таким именем уже существует'
            });
        }
        user = await usersFilter.getByEmail(email);
        if (user) {
            return res.status(400).json({
                message: 'Пользователь с такой почтой уже существует'
            });
        }

        const hashPassword = bcrypt.hashSync(password, 7);

        user = await usersDB.addUser({ name, email, hashPassword });

        if (!user) {
            res.status(400).json({ message: 'Косяк' });
            return;
        }
        return res.status(200).json({ message: 'Успешно' });
    }

    /**
     * Реализует логику проверок для логирования
     * @returns сгенерированный токен пользователя
     */
    async login (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                message: 'Ошибка при поптыке войти',
                errors
            });
        }
        const { name, email, password } = req.body;
        let user;

        // Поиск пользователя по почте или имени
        if (!name) {
            user = await usersFilter.getByEmail(email);
        } else {
            user = await usersFilter.getByName(name);
        }

        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }

        const hashUserPassword = user.getHashPassword();

        const isTruePassword = bcrypt.compareSync(
            String(password),
            hashUserPassword
        );

        if (!isTruePassword) {
            return res.status(400).json({ message: 'Пароль указан неверно' });
        }

        // Генирация токена доступа
        const userId = user.getId();
        const userRoles = user.getRoles();
        const accessToken = await AuthService.#generateAccessToken(
            userId,
            userRoles
        );
        res.status(200).json({ accessToken });
    }

    /**
     *
     * @param {*} userId Id пользователя
     * @param {*} roles массив ролей пользователя
     * @returns Сгенерированный токен доступа пользователя
     */
    static async #generateAccessToken (userId, roles) {
        const payload = { userId, roles };
        const secretWord = process.env.SECRET;
        return jwt.sign(payload, secretWord, { expiresIn: '3h' });
    }

    /**
     * @returns ответ с пользователями
     */
    async getAllUsers (req, res) {
        const users = await usersDB.getUsersPayload();

        if (!users.length) {
            res.status(404).json({ massge: 'Пользователей нет', users });
            return;
        }
        return res.status(200).send(users);
    }
}

/**
 * Экземпляр класса
 * @method registration : response
 * @method login : response.json(token)
 * @method #generateAccessToken : accessToken
 */
export const authService = new AuthService();
