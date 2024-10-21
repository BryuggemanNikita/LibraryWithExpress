import { usersRepository } from '../repositories/usersRepository.js';
import { Role } from '../enums/role.enum.js';
import { authorsRepository } from '../repositories/authorsRepository.js';

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
        if (isNaN(newRoleId)) {
            return res.status(400).json({ message: 'Неверно введена роль' });
        }

        // поиск соответствующей роли                        Изменить
        let newRole;
        for (let key in Role) {
            if (Role[key] == newRoleId) {
                newRole = Role[key];
            }
        }
        if (newRole == undefined) {
            return res.status(400).json({ message: 'роль не определена' });
        }

        // действия с пользователем
        const user = await usersRepository.getById(userId);
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }

        const userRoles = user.roles;

        if (userRoles.includes(newRole)) {
            return res.status(400).json({
                message: 'Пользователь уже имеет днную роль'
            });
        }

        userRoles.push(newRole);
        await usersRepository.updateUserInfoById(userId, { roles: userRoles });
        if (newRole == Role.AUTHOR) authorsRepository.changeInAuthors();

        return res.status(200).json({ message: 'Успешно' });
    }
}

/**
 * экземпляр класса
 * @method pushNewUserRole : {message}
 */
export const userService = new UserService();
