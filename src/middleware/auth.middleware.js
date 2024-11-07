import jwt from 'jsonwebtoken';
import env from 'dotenv';

env.config();

/**
 * Проверка на живость токена
 */
export const isAuthentificated = (req, res, next) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res
                .status(400)
                .json({ message: 'Пользователь не авторизован' });
        }

        const secretWord = process.env.SECRET;
        const decodedData = jwt.verify(token, secretWord);

        req.user = decodedData;
        next();
    } catch (e) {
        res.status(400).json({ message: 'Пользователь не авторизован' });
    }
};

/**
 * Проверка пользователя на подходящую роль
 * @param {*} roles - массив ролей, кто может использовать метод сервиса
 */
export const roleMiddleware = roles => {
    return function (req, res, next) {
        isAuthentificated(req, res, () => {
            const user = req.user;
            const userRoles = user.roles;

            let hasRole = false;

            for (let role of roles) {
                if (userRoles.includes(role)) hasRole = true;
            }

            if (!hasRole) {
                return res
                    .status(400)
                    .json({ message: 'У пользователя недостаточно прав' });
            }
            next();
        });
    };
};
