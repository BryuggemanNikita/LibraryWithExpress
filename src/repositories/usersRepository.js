import { wrapInPromise } from '../common/anyFunction/wrapInPromise.js';
import { Role } from '../enums/role.enum.js';
import Datastore from 'nedb';
import bcrypt from 'bcrypt';

const usersDataBase = new Datastore({
    filename: '../databases/users',
    autoload: true
});

/**
 * Репозиторий пользователей библиотеки
 * @method getUsers () : user[]
 * @method getAllByRole (findRole) : user[]
 * @method getByEmailOrName (email, name) : user[]
 * @method getByEmail (email) : user | undefined
 * @method getByName (name) : user | undefined
 * @method getUsersByRegular (findStr) : user[]
 * @method getById (userId) : user
 * @method getByFilter (payload) : user[]
 * @method addUser (payload) : user
 * @method deleteUser (payload) : boolean
 * @method updateUserInfoById (userId, payload) : bollean
 */
class UsersRepository {
    #usersDataBase;

    constructor (usersDataBase) {
        usersDataBase.loadDatabase();
        this.#usersDataBase = usersDataBase;
        this.find = wrapInPromise('find', usersDataBase);
        this.insert = wrapInPromise('insert', usersDataBase);
        this.delete = wrapInPromise('remove', usersDataBase);
        this.update = wrapInPromise('update', usersDataBase);
        this.getByName('admin').then(res => {
            if (!res) {
                const hashAdminPassword = bcrypt.hashSync('LibraryAdmin', 10);
                const adminRole = Role.ADMIN;

                this.#usersDataBase.insert({
                    name: 'admin',
                    email: 'admin@admin.ru',
                    hashPassword: hashAdminPassword,
                    roles: [adminRole]
                });
            }
        });
    }

    /**
     * Возвращает всех пользователей
     * @returns массив из пользователей, без пароля
     */
    getUsers () {
        return this.find({}, { hashPassword: 0 });
    }

    /**
     * Поиск пользователей по ролям
     * @param {*} findRole - искомая роль
     * @returns массив из пользователей с заданной ролью
     */
    getAllByRole (findRole) {
        return this.find(
            { roles: findRole },
            { hashPassword: 0, roles: 0, _id: 0 }
        );
    }

    /**
     * Поиск пользователей имеющие какой-то из аргументов
     * @param {*} email - совпадения по почте
     * @param {*} name - совпадения по имени
     * @returns массив из совпадений хотя-бы по одному параметру
     */
    getByEmailOrName (email, name) {
        return this.find({ $or: [{ email }, { name }] });
    }

    /**
     * Поиск совпадений среди пользователей по почте
     * @param {*} email - почта пользователя
     * @returns объект класса User | undefined
     */
    getByEmail (email) {
        return this.find({ email }, { hashPassword: 0 }).then(res => res[0]);
    }

    /**
     * Поиск совпадений среди пользователей по имени
     * @param {*} name - имя пользователя
     * @returns объект класса User | undefined
     */
    getByName (name) {
        return this.find({ name }, { hashPassword: 0 }).then(res => res[0]);
    }

    /**
     * Поиск совпадений в бд пользователей
     * @param {*} findStr - искомая подстрока
     * @returns массив из совпадений
     */
    getUsersByRegular (findStr) {
        const regular = new RegExp(`(${findStr})`);
        return this.find({ name: regular }, { hashPassword: 0 });
    }

    /**
     * Поиск пользователя по id
     * @param {*} userId - id искомого пользователя
     * @returns объект класса User | undefined
     */
    getById (userId) {
        return this.find({ _id: userId }).then(res => res[0]);
    }

    /**
     * Поиск пользователей по общему фильтру
     * @param {*} payload - {name?, email?, ...}
     * @returns
     */
    getByFilter (payload) {
        return this.find({ ...payload }, { password: 0 });
    }

    /**
     * Создает и добавляет пользователя в бд
     * @param {*} payload.name - имя пользователя
     * @param {*} payload.email - почта пользователя
     * @param {*} payload.hashPassword - захэшированный пароль
     * @returns user - объект добавленного пользователя
     */
    addUser (payload) {
        return this.insert({
            ...payload,
            roles: [Role.JUST_USER]
        });
    }

    /**
     * Удаляет пользователя из бд
     * @param {*} payload.userId id пользователя
     * @returns результат операции : user | undefined
     */
    deleteUser (userId) {
        return this.delete({ id: userId });
    }

    /**
     * Обновление информации о пользователе в бд
     * @param {*} userId - id пользователя для изменения
     * @param {*} payload - {name?, email?, roles?}
     * @returns
     */
    updateUserInfoById (userId, payload) {
        return this.update({ _id: userId }, { $set: { ...payload } }, {});
    }
}

/**
 * Репозиторий пользователей библиотеки
 * @method getUsers () : user[]
 * @method getAllByRole (findRole) : user[]
 * @method getByEmailOrName (email, name) : user[]
 * @method getByEmail (email) : user | undefined
 * @method getByName (name) : user | undefined
 * @method getUsersByRegular (findStr) : user[]
 * @method getById (userId) : user
 * @method getByFilter (payload) : user[]
 * @method addUser (payload) : user
 * @method deleteUser (payload) : boolean
 * @method updateUserInfoById (userId, payload) : bollean
 */
export const usersRepository = new UsersRepository(usersDataBase);

/**
 * Репозиотрий авторов на основе репозитория пользователей
 * @method getById (authorId) : user
 * @method getByRegular (findStr) : user[]
 */
class AuthorsRepository {
    #usersRepository;

    constructor (usersRepository) {
        this.#usersRepository = usersRepository;
    }

    /**
     * Поиск автора в бд по id
     * @param {*} authorId - id искомого автора
     * @returns автор по совпадению
     */
    getById (authorId) {
        return this.#usersRepository.getByFilter({
            roles: Role.AUTHOR,
            _id: authorId
        });
    }

    /**
     * Поиск авторов по совпадению в имени
     * @param {*} findStr - искомая подстрока
     * @returns
     */
    getByRegular (findStr) {
        const regular = new RegExp(`(${findStr})`);
        return this.#usersRepository.getByFilter({
            roles: Role.AUTHOR,
            name: regular
        });
    }
}

/**
 * Репозиотрий авторов на основе репозитория пользователей
 * @method getById (authorId) : user
 * @method getByRegular (findStr) : user[]
 */
export const authorsRepository = new AuthorsRepository(usersRepository);
