import { Role } from '../enums/role.enum.js';
import { usersRepository } from './usersRepository.js';
import { UserDto } from '../dto/UserDto.js';

/**
 * Репозиторий пользователей библиотеки
 * @method getAuthors () : user[]
 * @method getAuthorsPayload() : userPayload[]
 * @method addAuthor (user) : newUser
 * @method deleteAuthor (payload) : {flag, message}
 */
class AuthorsRepositry {
    #changesInAuthors = true;
    #authors;

    /**
     * @returns копия массива авторов(объектов класса User) из репозитория
     */
    async getAuthors () {
        if (!this.#changesInAuthors) return this.#authors;

        const users = await usersRepository.getUsers();
        if(!users.length) return [];

        const authorRole = Role.AUTHOR;
        const usersAndAuthors = users.filter(user =>
            user.roles.includes(authorRole)
        );
        if(!usersAndAuthors) return [];

        const aturhorsPayload = usersAndAuthors.map(user => {
            const { name, email, _id } = user;
            return new UserDto(name, email, _id);
        });
        this.#authors = aturhorsPayload;
        this.#changesInAuthors = false;
        return aturhorsPayload;
    }

    /**
     * Поиск автора по id
     * @param {*} id - id искомого автора
     * @returns объект класса author(User) || undefined
     */
    async getByID (id) {
        const userWithSearchId = await usersRepository.getById(id);
        const authorRole = Role.AUTHOR;
        if (!userWithSearchId || !userWithSearchId.roles.includes(authorRole))
            return;

        const { name, email, _id } = userWithSearchId;
        return new UserDto(name, email, _id);
    }

    /**
     * Поиск авторов по совпадениям в имени | подстроке
     * @param {*} findName - искомое имя | подстрока
     * @returns массив авторов(payload)
     */
    async getByRegExp (name) {
        const users = await usersRepository.getUsersByRegular(name);
        if (!users.length) return [];

        const authorRole = Role.AUTHOR;
        const authors = users.filter(user => user.roles.includes(authorRole));
        if (!authors.length) return [];

        const authrorsPayload = authors.map(authors => {
            const { name, email, _id } = authors;
            return new UserDto(name, email, _id);
        });
        if(!authrorsPayload) return [];
        return authrorsPayload
    }

    async changeInAuthors(){
        this.#changesInAuthors = true;
    }
}

/**
 * Репозиторий авторов в библиотеке
 * @method getAuthors() : user[]
 * @method getAuthorsPayload : userPayload[]
 * @method addAuthor(user) : newUser
 * @method deleteAuthor(payload) : {flag, message}
 */
export const authorsRepository = new AuthorsRepositry();
