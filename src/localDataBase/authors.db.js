import { body } from 'express-validator';
import { Role } from '../enums/role.enum.js';

/**
 * Репозиторий пользователей библиотеки
 * @method getAuthors () : user[]
 * @method getAuthorsPayload() : userPayload[]
 * @method addAuthor (user) : newUser
 * @method deleteAuthor (payload) : {flag, message}
 */
class AuthorsDataBase {
    #authors;

    constructor () {
        this.#authors = new Set();
    }

    /**
     * @returns копия массива авторов(объектов класса User) из репозитория
     */
    async getAuthors () {
        const authors = [];
        this.#authors.forEach(author => {
            authors.push(author);
        });
        return authors;
    }

    /**
     * @returns копия массива полезной нагрузки авторов в репозиторий
     */
    async getAuthorsPayload () {
        const authordPayload = [];
        this.#authors.forEach(author => {
            authordPayload.push(author.getPayload());
        });
        return authordPayload;
    }

    /**
     * Создает и добавляет автора в репозиторий
     * @param {*} user - автор(объект класса User)
     * @returns user - объект добавленного автора
     */
    async addAuthor (user) {
        const userRoles = user.getRoles();
        if (!userRoles.includes(Role.AUTHOR)) return;
        this.#authors.add(user);
        return user;
    }

    /**
     * Удаляет автора из репозитория
     * @param {*} payload.userId id пользователя
     * @returns результат операции : author | undefined
     */
    async deleteAuthor (userId) {
        let resolut;
        for (let user of this.#authors) {
            if (user.getId() == userId) {
                resolut = user;
                break;
            }
        }
        this.#authors.delete(user);
        return resolut;
    }
}

/**
 * Репозиторий авторов в библиотеке
 * @method getAuthors() : user[]
 * @method getAuthorsPayload : userPayload[]
 * @method addAuthor(user) : newUser
 * @method deleteAuthor(payload) : {flag, message}
 */
export const authorsDB = new AuthorsDataBase();
