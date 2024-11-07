import { ExceptionForHandler } from '../common/exception/error.js';
import { exceptionGenerator } from '../common/exception/exceptionGenerator.js';
import { usersRepository } from '../repositories/usersRepository.js';
import { isOnlyWords } from '../common/stringTests/IsOnlyWords.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();

/**
 * Сервис взаимодействия с authorization
 * все методы являются асинхронными, кроме #generateAccessToken
 * @method registration : {message} | ExceptionForHandler
 * @method login : {token} | ExceptionForHandler
 * @method #generateAccessToken : accessToken | ExceptionForHandler
 * @method getAllUsers : {message, users:user[]} | ExceptionForHandler
 */
class AuthService {
    /**
     * Регистрация пользователя
     * @returns ответ на сервер
     */
    async registration (req, res) {
        // обработка ошибок
        exceptionGenerator.testByValidator(req);

        const { name, email, password } = req.body;

        // проверка name
        const isOnlyWordsInName = isOnlyWords(name);
        if (!isOnlyWordsInName)
            throw new ExceptionForHandler({
                status: 400,
                message: 'В имени должны быть только буквы'
            });

        // проверка на совпадения в бд
        const users = await usersRepository.getByEmailOrName(email, name);

        let user = users[0];
        if (user) {
            const message =
                user.name == name
                    ? 'Пользователь с таким именем уже существует'
                    : 'Пользователь с такой почтой уже существует';
            throw new ExceptionForHandler({
                status: 400,
                message
            });
        }

        const hashPassword = bcrypt.hashSync(password, 7);
        user = await usersRepository.addUser({ name, email, hashPassword });

        if (!user)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Не удалось добавить пользователя'
            });
        return res.status(200).json({ message: 'Успешно' });
    }

    /**
     * Реализует логику проверок для логирования
     * @returns сгенерированный токен пользователя
     */
    async login (req, res) {
        exceptionGenerator.testByValidator(req);

        // Поиск пользователя по почте или имени
        const { login, password } = req.body;

        const users = await usersRepository.getByEmailOrName(login, login);
        const user = users[0];

        if (!user)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Пользователь не найден'
            });

        const hashUserPassword = user.hashPassword;
        const isTruePassword = bcrypt.compareSync(
            String(password),
            hashUserPassword
        );
        if (!isTruePassword)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Пароль указан неверно'
            });

        // Генирация токена доступа
        const userId = user._id;
        const userRoles = user.roles;
        const accessToken = await AuthService.#generateAccessToken(
            userId,
            userRoles
        );

        res.cookie('accessToken', accessToken, {
            httpOnly: true
        });

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
        if (!users)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Ошибка запроса к репозиторию'
            });
        return res.status(200).send({ message: 'Успешно', users });
    }
}

/**
 * Экземпляр класса
 * все методы являются асинхронными, кроме #generateAccessToken
 * @method registration : {message} | ExceptionForHandler
 * @method login : {token} | ExceptionForHandler
 * @method #generateAccessToken : accessToken | ExceptionForHandler
 * @method getAllUsers : {message, users:user[]} | ExceptionForHandler
 */
export const authService = new AuthService();
