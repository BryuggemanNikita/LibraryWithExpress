import { ExceptionForHandler } from '../exception/error.js';
import { usersRepository } from '../repositories/usersRepository.js';
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
        const { userId, newRoleId } = req.body;

        // проверки на значения
        if (isNaN(newRoleId))
            throw new ExceptionForHandler({
                status: 400,
                message: 'Неверно введена роль'
            });

        let newRole;
        for (let key in Role) {
            if (Role[key] === newRoleId) {
                newRole = Role[key];
            }
        }
        if (newRole == undefined)
            throw new ExceptionForHandler({
                status: 400,
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
