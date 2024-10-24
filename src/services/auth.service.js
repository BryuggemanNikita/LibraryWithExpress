import { IsOnlyWords } from '../stringTests/IsOnlyWords.js';
import { usersRepository } from '../repositories/usersRepository.js';
import { handlingErrors } from '../exception/exceptionValidator.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

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
        await handlingErrors.errorsHendlingForValidator(
            req,
            res,
            'Ошибка при регистрации'
        );

        const { name, email, password } = req.body;

        // проверка name
        const isOnlyWordsInName = IsOnlyWords(name);
        await handlingErrors.responseError(
            !isOnlyWordsInName,
            400,
            'В имени должны быть только буквы',
            res
        );

        // проверка на совпадения в бд
        let user = await usersRepository.getByName(name);
        await handlingErrors.responseError(
            user,
            400,
            'Пользователь с таким именем уже существует',
            res
        );

        user = await usersRepository.getByEmail(email);
        await handlingErrors.responseError(
            user,
            400,
            'Пользователь с такой почтой уже существует',
            res
        );

        const hashPassword = bcrypt.hashSync(password, 7);

        user = await usersRepository.addUser({ name, email, hashPassword });
        await handlingErrors.responseError(!user, 400, 'Косяк', res);

        return res.status(200).json({ message: 'Успешно' });
    }

    /**
     * Реализует логику проверок для логирования
     * @returns сгенерированный токен пользователя
     */
    async login (req, res) {
        await handlingErrors.errorsHendlingForValidator(
            req,
            res,
            'Ошибка при поптыке войти'
        );

        const { name, email, password } = req.body;
        let user;

        // Поиск пользователя по почте или имени
        if (!name) {
            user = await usersRepository.getByEmail(email);
        } else {
            user = await usersRepository.getByName(name);
        }

        await handlingErrors.responseError(
            !user,
            400,
            'Пользователь не найден',
            res
        );

        const hashUserPassword = user.password;
        const isTruePassword = bcrypt.compareSync(
            String(password),
            hashUserPassword
        );

        await handlingErrors.responseError(
            !isTruePassword,
            400,
            'Пароль указан неверно',
            res
        );

        // Генирация токена доступа
        const userId = user._id;
        const userRoles = user.roles;
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
        return jwt.sign(payload, secretWord, { expiresIn: '24h' });
    }

    /**
     * @returns ответ с пользователями
     */
    async getAllUsers (req, res) {
        const users = await usersRepository.getUsers();
        await handlingErrors.responseError(
            !users,
            404,
            'Ошибка запроса к репозиторию',
            res
        );

        return res.status(200).send({ message: 'Успешно', users });
    }
}

/**
 * Экземпляр класса
 * @method registration : response
 * @method login : response.json(token)
 * @method #generateAccessToken : accessToken
 */
export const authService = new AuthService();
