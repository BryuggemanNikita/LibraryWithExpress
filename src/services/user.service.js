import { ExceptionForHandler } from '../common/exception/error.js';
import { usersRepository } from '../repositories/usersRepository.js';
import { valueInObject } from '../common/anyFunction/valueInObject.js';
import { Role } from '../enums/role.enum.js';

/**
 * Сервер взаимодействия с user
 * @method pushNewUserRole : {message}
 */
class UserService {
    /**
     * Метод реализующий добавление новой роли пользователю
     * @returns ответ с результатом
     */
    async pushNewUserRole (req, res) {
        const { userId, newRole } = req.body;

        // проверки на значения
        const isGoodRole = valueInObject(newRole, Role);
        if (!isGoodRole)
            throw new ExceptionForHandler({
                status: 404,
                message: 'роль не определена'
            });

        // действия с пользователем
        const user = await usersRepository.getById(userId);
        if (!user)
            throw new ExceptionForHandler({
                status: 404,
                message: 'Пользователь не найден'
            });

        const userRoles = user.roles;
        const isUserHasThisRole = userRoles.includes(newRole);
        if (isUserHasThisRole)
            throw new ExceptionForHandler({
                status: 400,
                message: 'Пользователь уже имеет днную роль'
            });

        userRoles.push(newRole);
        await usersRepository.updateUserInfoById(userId, { roles: userRoles });

        return res.status(200).json({ message: 'Успешно' });
    }
}

/**
 * экземпляр класса
 * @method pushNewUserRole : {message}
 */
export const userService = new UserService();
