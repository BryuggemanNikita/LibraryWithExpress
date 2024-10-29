import Datastore from 'nedb-promises';

const libraryDataBase = Datastore.create('../dataBases/library');

/**
 * Репозиторий авторов и их книг
 * @method getLibrary() : book[]
 * @method getAuthorLibraryById (authorID) : bookId[]
 * @method addBook (book, authorID) : boolean
 * @method deleteBookById (bookId) : boolean
 */
class AuthorToBooksRepository {
    #libraryDataBase;

    constructor (libraryDataBase) {
        libraryDataBase.loadDatabase();
        this.#libraryDataBase = libraryDataBase;
    }

    /**
     * Полное содержание библиотеки
     * @returns Библиотеку
     */
    getLibrary () {
        return this.#libraryDataBase.find({}, { _id: 0 });
    }

    /**
     * Библиотеку автора по его id
     * @param {*} authorId - id автора
     * @returns bookId[]
     */
    getAuthorLibraryById (authorId) {
        return this.#libraryDataBase.find(
            { authorId },
            { authorId: 0, _id: 0 }
        );
    }

    /**
     * Добавляет книгу в репозиторий
     * @param {*} bookPayload - payload объекта класса Book
     * @param {*} authorID - id автора который
     * @returns наличие автора в библиотеке
     */
    addBook (authorId, bookId) {
        return this.#libraryDataBase.insert({ authorId, bookId });
    }

    /**
     * Удаляет книгу из репозитория
     * @param {*} bookID -
     * @param {*} authorID
     * @returns наличие автора в бд --> успешность результата
     */
    deleteBookById (bookId) {
        return this.#libraryDataBase.remove({ bookId }, { multi: true });
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
