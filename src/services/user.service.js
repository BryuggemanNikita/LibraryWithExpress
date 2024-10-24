import { usersRepository } from '../repositories/usersRepository.js';
import { handlingErrors } from '../exception/exceptionValidator.js';
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
        await handlingErrors.responseError(
            isNaN(newRoleId),
            400,
            'Неверно введена роль',
            res
        );

        let newRole;
        for (let key in Role) {
            if (Role[key] === newRoleId) {
                newRole = Role[key];
            }
        }
        await handlingErrors.responseError(
            newRole == undefined,
            400,
            'роль не определена',
            res
        );

        // действия с пользователем
        const user = await usersRepository.getById(userId);
        await handlingErrors.responseError(
            !user,
            400,
            'Пользователь не найден',
            res
        );

        const userRoles = user.roles;
        const isUserHasThisRole = userRoles.includes(newRole);
        await handlingErrors.responseError(
            isUserHasThisRole,
            400,
            'Пользователь уже имеет днную роль',
            res
        );

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
