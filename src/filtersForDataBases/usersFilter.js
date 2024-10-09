import { usersDB } from '../localDataBase/users.db.js';

/**
 * Класс с методами, реализующий фильтрацию пользователей по данным
 * @method getByEmail (email) : user | indefined
 * @method getByName (name) : user | undefined
 * @method getById (userId) : user | undefined
 */
class UsersFilter {
    /**
     * Поиск совпадений среди пользователей по почте
     * @param {*} email - почта пользователя
     * @returns объект класса User | undefined
     */
    async getByEmail (email) {
        const users = await usersDB.getUsers();
        let resolut;
        for (let user of users) {
            if (user.getEmail() === email) {
                resolut = user;
                break;
            }
        }
        return resolut;
    }

    /**
     * Поиск совпадений среди пользователей по имени
     * @param {*} name - имя пользователя
     * @returns объект класса User | undefined
     */
    async getByName (name) {
        const users = await usersDB.getUsers();
        let resolut;
        for (let user of users) {
            if (user.getName() === name) {
                resolut = user;
                break;
            }
        }
        return resolut;
    }

    /**
     * Поиск пользователя по id
     * @param {*} userId - id искомого пользователя
     * @returns объект класса User | undefined
     */
    async getById (userId) {
        const users = await usersDB.getUsers();
        let resolut;
        for (let user of users) {
            if (user.getId() === userId) {
                resolut = user;
                break;
            }
        }
        return resolut;
    }
}

/**
 * Экземпляр класса, реализующий фильтрацию пользователей по данным
 * @method getByEmail(email) : user
 * @method getByName(name) : user
 */
export const usersFilter = new UsersFilter();
