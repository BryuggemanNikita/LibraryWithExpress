import Datastore from 'nedb';
import bcrypt from 'bcrypt';
import { Role } from '../enums/role.enum.js';

const usersDataBase = new Datastore({
    filename: '../dataBases/users'
});

/**
 * Репозиторий пользователей библиотеки
 * @method getUsers () : user[]
 * @method getUsersPayload () : userPayload[]
 * @method addUser (payload) : newUser
 * @method deleteUser (payload) : {flag, message}
 */
class UsersRepository {
    #usersDataBase;

    constructor (usersDataBase) {
        usersDataBase.loadDatabase();
        this.#usersDataBase = usersDataBase;

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
     * @returns копия массива объектов класса User из репозитория
     */
    getUsers () {
        return new Promise(res => {
            this.#usersDataBase.find({}, { password: 0 }, (err, docs) => {
                res(docs);
            });
        });
    }

    getAllByRole (findRole) {
        return new Promise(res => {
            this.#usersDataBase.find(
                { roles: findRole },
                { password: 0, roles: 0, _id: 0 },
                (err, docs) => {
                    res(docs);
                }
            );
        });
    }

    getByEmailOrName (email, name) {
        return new Promise(res => {
            this.#usersDataBase.find(
                { $or: [{ email }, { name }] },
                (err, docs) => {
                    res(docs);
                }
            );
        });
    }

    /**
     * Поиск совпадений среди пользователей по почте
     * @param {*} email - почта пользователя
     * @returns объект класса User | undefined
     */
    getByEmail (email) {
        return new Promise(res => {
            this.#usersDataBase.find({ email }, (err, docs) => {
                res(docs[0]);
            });
        });
    }

    /**
     * Поиск совпадений среди пользователей по имени
     * @param {*} name - имя пользователя
     * @returns объект класса User | undefined
     */
    getByName (name) {
        return new Promise(res => {
            this.#usersDataBase.find({ name }, (err, docs) => {
                res(docs[0]);
            });
        });
    }

    getUsersByRegular (findStr) {
        return new Promise(res => {
            const regular = new RegExp(`(${findStr})`);
            this.#usersDataBase.find({ name: regular }, (err, docs) => {
                res(docs);
            });
        });
    }

    /**
     * Поиск пользователя по id
     * @param {*} userId - id искомого пользователя
     * @returns объект класса User | undefined
     */
    getById (userId) {
        return new Promise(res => {
            this.#usersDataBase.find({ _id: userId }, (err, docs) => {
                res(docs[0]);
            });
        });
    }

    getByFilter (payload) {
        return new Promise(res => {
            this.#usersDataBase.find(
                { ...payload },
                { password: 0 },
                (err, docs) => {
                    res(docs);
                }
            );
        });
    }

    /**
     * Создает и добавляет пользователя в репозиторий
     * @param {*} payload.name - имя пользователя
     * @param {*} payload.email - почта пользователя
     * @param {*} payload.hashPassword - захэшированный пароль
     * @returns user - объект добавленного пользователя
     */
    addUser (payload) {
        return new Promise(res => {
            this.#usersDataBase.insert(
                {
                    ...payload,
                    roles: [Role.JUST_USER]
                },
                (err, docs) => {
                    res(docs);
                }
            );
        });
    }

    /**
     * Удаляет пользователя из репозитория
     * @param {*} payload.userId id пользователя
     * @returns результат операции : user | undefined
     */
    deleteUser (userId) {
        return new Promise(res => {
            this.#usersDataBase.remove({ id: userId }, (err, docs) => {
                res(docs[0]);
            });
        });
    }

    updateUserInfoById (userId, payload) {
        return new Promise(res => {
            this.#usersDataBase.update(
                { _id: userId },
                { $set: { ...payload } },
                {},
                () => {
                    this.#usersDataBase.loadDatabase();
                }
            );
            res();
        });
    }
}

/**
 * Репозиторий пользователей библиотеки
 * @method getUsers() : user[]
 * @method getUsersPayload : userPayload[]
 * @method addUser(payload) : newUser
 * @method deleteUser(payload) : {flag, message}
 */
export const usersRepository = new UsersRepository(usersDataBase);

class AuthorsRepository {
    #usersRepository;

    constructor (usersRepository) {
        this.#usersRepository = usersRepository;
    }

    getById (authorId) {
        return this.#usersRepository.getByFilter({
            roles: Role.AUTHOR,
            _id: authorId
        });
    }

    getByRegular (findStr) {
        const regular = new RegExp(`(${findStr})`);
        return this.#usersRepository.getByFilter({
            roles: Role.AUTHOR,
            name: regular
        });
    }
}

export const authorsRepository = new AuthorsRepository(usersRepository);
