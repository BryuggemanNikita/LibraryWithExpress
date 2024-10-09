import { authorsDB } from '../localDataBase/authors.db.js';

/**
 * Класс с методами, реализующий фильтрацию авторов по данным
 * @method getByID(id) : author(User) | undefined
 * @method getByRegExp(findName) : authorPayload[]
 */
class AuthorsFilter {
    /**
     * Поиск автора по id
     * @param {*} id - id искомого автора
     * @returns объект класса author(User) || undefined
     */
    async getByID (id) {
        const authors = await authorsDB.getAuthors();
        let resolut;
        for (let author of authors) {
            if (author.getId() === id) {
                resolut = author;
                break;
            }
        }
        return resolut;
    }

    /**
     * Поиск авторов по совпадениям в имени | подстроке
     * @param {*} findName - искомое имя | подстрока
     * @returns массив авторов(payload)
     */
    async getByRegExp (findName) {
        const authors = await authorsDB.getAuthors();
        let resAuthors = [];
        authors.forEach(author => {
            const name = author.getName();
            if (name.includes(findName)) {
                const authorPayload = author.getPayload();
                resAuthors.push(authorPayload);
            }
        });
        return resAuthors;
    }
}

/**
 * Экземпляр класса, реализующий фильтрацию авторов по данным
 * @method getByID(id) : author(User) | undefined
 * @method getByRegExp(findName) : authorPayload[]
 *
 */
export const authorsFilter = new AuthorsFilter();
