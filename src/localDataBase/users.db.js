import { User } from '../classes/User.js';
import { Role } from '../enums/role.enum.js';
import bcrypt from 'bcrypt';

/**
 * Репозиторий пользователей библиотеки
 * @method getUsers () : user[]
 * @method getUsersPayload () : userPayload[]
 * @method addUser (payload) : newUser
 * @method deleteUser (payload) : {flag, message}
 */
class UsersDataBase {
    static #ID = 0;
    #users;

    constructor () {
        this.#users = new Set();

        const hashAdminPassword = bcrypt.hashSync('LibraryAdmin', 10);
        const adminRole = Role.ADMIN;
        const adminId = UsersDataBase.#ID;
        const admin = new User(
            'admin',
            'admin@admin.ru',
            hashAdminPassword,
            adminRole,
            adminId
        );
        this.#users.add(admin);
        UsersDataBase.#ID++;
    }

    /**
     * @returns копия массива объектов класса User из репозитория
     */
    async getUsers () {
        const users = [];
        this.#users.forEach(user => {
            users.push(user);
        });
        return users;
    }

    /**
     * @returns копия массива полезной нагрузки пользователей из репозитория
     */
    async getUsersPayload () {
        const usersPayload = [];
        this.#users.forEach(user => {
            usersPayload.push(user.getPayload());
        });
        return usersPayload;
    }

    /**
     * Создает и добавляет пользователя в репозиторий
     * @param {*} payload.name - имя пользователя
     * @param {*} payload.email - почта пользователя
     * @param {*} payload.hashPassword - захэшированный пароль
     * @returns user - объект добавленного пользователя
     */
    async addUser (payload) {
        const userId = UsersDataBase.#ID;
        const { name, email, hashPassword } = payload;
        const role = Role.JUST_USER;
        const user = new User(name, email, hashPassword, role, userId);

        UsersDataBase.#ID++;
        this.#users.add(user);
        return user;
    }

    /**
     * Удаляет пользователя из репозитория
     * @param {*} payload.userId id пользователя
     * @returns результат операции : user | undefined
     */
    async deleteUser (userId) {
        let resolut;
        for (let user of this.#users) {
            if (user.getId() == userId) {
                resolut = user;
                break;
            }
        }
        this.#users.delete(user);
        return resolut;
    }
}

/**
 * Репозиторий пользователей библиотеки
 * @method getUsers() : user[]
 * @method getUsersPayload : userPayload[]
 * @method addUser(payload) : newUser
 * @method deleteUser(payload) : {flag, message}
 */
export const usersDB = new UsersDataBase();
