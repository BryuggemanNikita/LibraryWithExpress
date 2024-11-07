import { wrapInPromise } from '../common/anyFunction/wrapInPromise.js';
import Datastore from 'nedb';

const booksDataBase = new Datastore({
    filename: '../dataBases/books',
    autoload: true
});

/**
 * Репозиторий книг в библиотеке
 * @method getBooks () : book[]
 * @method getBooksByFilter (payload) : book[]
 * @method getById (bookId) : book
 * @method getByRegExp (name) : book[]
 * @method addBook (payload) : newBook
 * @method updateBookInfo (bookId, payload) : boolean
 * @method deleteBook (payload) : {flag, message}
 */
class BooksRepository {
    constructor (booksDataBase) {
        booksDataBase.loadDatabase();
        this.find = wrapInPromise('find', booksDataBase);
        this.insert = wrapInPromise('insert', booksDataBase);
        this.delete = wrapInPromise('remove', booksDataBase);
        this.update = wrapInPromise('update', booksDataBase);
    }

    /**
     * Обновление информации о книге
     * @param {*} bookId - id книги
     * @param {*} payload - параметры которые можно обновить (name?, genre?, countPages?)
     * @returns
     */
    updateBookInfo (bookId, payload) {
        return this.update({ _id: bookId }, { $set: { ...payload } });
    }

    /**
     * Возвращает все книги
     * @returns все книги из бд
     */
    getBooks () {
        return this.find({});
    }

    /**
     * Поиск книг в бд по фильтру
     * @param {*} payload - (name?, genre?, countPages?)
     * @returns книги по фильтру
     */
    getBooksByFilter (payload) {
        return this.find({ ...payload });
    }

    /**
     * Поиск книги в бд по заданному id
     * @param {*} bookId - id искомой книги
     * @returns объект книги
     */
    getById (bookId) {
        return this.find({ _id: bookId }).then(res => res[0]);
    }

    /**
     * Поиск книг по совпадениям в названии | подстроке
     * @param {*} findName - искомое название | подстрока
     * @returns массив книг по совпадению
     */
    getByRegExp (name) {
        const regular = new RegExp(`(${name})`);
        return this.find({ name: regular });
    }

    /**
     * Создает и добавляет книгу в бд
     * @param {*} payload.name - название книги
     * @param {*} payload.countPages - количесвто страниц
     * @param {*} payload.genre - жанр книги
     * @returns book - объект добавленной книги
     */
    addBook (payload) {
        return this.insert({ ...payload });
    }

    /**
     * Удаляет книгу из бд
     * @param {*} bookId id книги
     * @returns результат операции : book | undefined
     */
    deleteBook (bookId) {
        return this.delete({ _id: bookId });
    }
}

/**
 * Репозиторий книг в библиотеке
 * @method getBooks () : book[]
 * @method getBooksByFilter (payload) : book[]
 * @method getById (bookId) : book
 * @method getByRegExp (name)
 * @method addBook (payload) : newBook
 * @method updateBookInfo (bookId, payload) : boolean
 * @method deleteBook (payload) : {flag, message}
 */
export const booksRepository = new BooksRepository(booksDataBase);
