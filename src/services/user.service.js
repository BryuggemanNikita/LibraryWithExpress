import { authorsDB } from '../localDataBase/authors.db.js';
import { libraryDB } from '../localDataBase/library.db.js';

import { Role } from '../enums/role.enum.js';
import { usersFilter } from '../filtersForDataBases/usersFilter.js';

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
        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Неверно введен id' });
        }
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
        const user = await usersFilter.getById(userId);
        if (!user) {
            return res.status(400).json({ message: 'Пользователь не найден' });
        }
        const userRoles = user.getRoles();
        if (userRoles.includes(newRole)) {
            return res.status(400).json({
                message: 'Пользователь уже имеет данную роль'
            });
        }
        user.pushRole(newRole);

        // Проверка на роль(автор) ---> создать нового автора в базу данных
        if (newRole == Role.AUTHOR) {
            await libraryDB.addNewAuthorInLibrary(user.getId());
            authorsDB.addAuthor(user);
        }

        return res.status(200).json({ message: 'Успешно' });
    }
}

/**
 * экземпляр класса
 * @method pushNewUserRole : {message}
 */
export const userService = new UserService();
