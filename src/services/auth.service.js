import { UserService } from './user.service.js';
import { Role } from '../enums/role.enum.js';
import bcrypt from 'bcrypt';
import env from 'dotenv';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';

env.config();
export const userService = new UserService();

export class AuthService {
    async registration (req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.status(400).json({ message: 'Ошибка при регистрации', errors });
            return;
        }

        const { username, email, password } = req.body;

        const hashPassword = bcrypt.hashSync(password, 7);
        const role = Role.JUST_USER;

        const { flag, message } = await userService.pushNewUser(
            username,
            email,
            hashPassword,
            role
        );

        if (!flag) {
            res.status(400).json({ message });
            return;
        }
        return res.status(200).json({ message });
    }

    async login (req, res) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.status(400).json({
                message: 'Ошибка при поптыке войти',
                errors
            });
        }
        const { username, email, password } = req.body;
        let user;
        if (!username) {
            user = await userService.getUserByEmail(email);
        } else {
            user = await userService.getUserByName(username);
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
            res.status(400).json({ message: 'Пароль указан неверно' });
            return;
        }

        const userId = user.getId();
        const userRoles = user.getRoles();
        const acessToken = await AuthService.#generateAcessToken(
            userId,
            userRoles
        );
        res.status(200).json({ acessToken });
    }

    static async #generateAcessToken (id, roles) {
        const payload = { id, roles };
        const secretWord = process.env.SECRET;
        return jwt.sign(payload, secretWord, { expiresIn: '20m' });
    }

    async getAllUsers (req, res) {
        const users = await userService.getAllUsers();

        if (!users.length) {
            res.status(404).json({ massge: 'Пользователей нет', users });
            return;
        }
        return res.status(200).send(users);
    }
}
