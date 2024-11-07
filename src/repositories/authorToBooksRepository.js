import { wrapInPromise } from '../common/anyFunction/wrapInPromise.js';
import Datastore from 'nedb';

const libraryDataBase = new Datastore({
    filename: '../dataBases/library',
    autoload: true
});

/**
 * Репозиторий авторов и их книг
 * @method getLibrary() : book[]
 * @method getAuthorLibraryById (authorID) : bookId[]
 * @method addBook (book, authorID) : boolean
 * @method deleteBookById (bookId) : boolean
 */
class AuthorToBooksRepository {
    constructor (libraryDataBase) {
        libraryDataBase.loadDatabase();
        this.find = wrapInPromise('find', libraryDataBase);
        this.insert = wrapInPromise('insert', libraryDataBase);
        this.delete = wrapInPromise('remove', libraryDataBase);
        this.update = wrapInPromise('update', libraryDataBase);
    }

    /**
     * Полное содержание библиотеки
     * @returns Библиотеку
     */
    getLibrary () {
        return this.find({}, { _id: 0 });
    }

    /**
     * Библиотеку автора по его id
     * @param {*} authorId - id автора
     * @returns bookId[]
     */
    getAuthorLibraryById (authorId) {
        return this.find({ authorId }, { authorId: 0, _id: 0 });
    }

    /**
     * Добавляет книгу в репозиторий
     * @param {*} bookPayload - payload объекта класса Book
     * @param {*} authorID - id автора который
     * @returns наличие автора в библиотеке
     */
    addBook (authorId, bookId) {
        return this.insert({ authorId, bookId });
    }

    /**
     * Удаляет книгу из репозитория
     * @param {*} bookID -
     * @param {*} authorID
     * @returns наличие автора в бд --> успешность результата
     */
    deleteBookById (bookId) {
        return this.delete({ bookId }, { multi: true });
    }
}
/**
 * Репозиторий авторов и их книг
 * @method getLibrary() : book[]
 * @method getAuthorLibraryById (authorID) : bookId[]
 * @method addBook (book, authorID) : boolean
 * @method deleteBookById (bookId) : boolean
 */
export const authorToBooksRepository = new AuthorToBooksRepository(
    libraryDataBase
);
