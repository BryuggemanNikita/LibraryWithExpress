import Datastore from 'nedb';

const libraryDataBase = new Datastore({
    filename: '../dataBases/library'
});

/**
 * Репозиторий авторов и их книг
 * @method getLibrary() : book[]
 * @ реализовать payload library
 * @method addNewAuthorInLibrary (authorID) :
 * @method addBook (book, authorID) : boolean
 * @method deleteBy2ID (bookID, authorID) : boolean
 * @method deleteAuthorLibrary (authorID) : bookId[]
 */
class AuthorToBooksRepository {
    #libraryDataBase;

    constructor (libraryDataBase) {
        libraryDataBase.loadDatabase();
        this.#libraryDataBase = libraryDataBase;
    }

    /**
     * Полное содержание библиотеки [авторId -> книгаId]
     * @returns Библиотеку
     */
    getLibrary () {
        return new Promise(res => {
            this.#libraryDataBase.find({}, { _id: 0 }, (err, docs) => {
                res(docs);
            });
        });
    }

    /**
     * Библиотеку автора по его id
     * @param {*} authorId - id автора
     * @returns bookId[]
     */
    getAuthorLibraryById (authorId) {
        return new Promise(res => {
            this.#libraryDataBase.find(
                { authorId },
                { authorId: 0, _id: 0 },
                (err, docs) => {
                    res(docs);
                }
            );
        });
    }

    /**
     * Добавляет книгу в репозиторий
     * @param {*} bookPayload - payload объекта класса Book
     * @param {*} authorID - id автора который
     * @returns наличие автора в библиотеке
     */
    addBook (authorId, bookId) {
        return new Promise(res => {
            this.#libraryDataBase.insert({ authorId, bookId }, (err, docs) => {
                res(docs);
            });
        });
    }

    /**
     * Удаляет книгу из репозитория
     * @param {*} bookID -
     * @param {*} authorID
     * @returns наличие автора в бд --> успешность результата
     */
    deleteBookById (bookId) {
        return new Promise(res => {
            this.#libraryDataBase.remove(
                { bookId },
                { multi: true },
                (err, docs) => {
                    res(docs);
                }
            );
        });
    }
}

/**
 * Репозиторий авторов и их книг
 * @method getLibrary() : book[]
 * @ реализовать payload library
 * @method addNewAuthorInLibrary (authorID) :
 * @method addBook (book, authorID) : boolean
 * @method deleteBy2ID (bookID, authorID) : boolean
 * @method deleteAuthorLibrary (authorID) : bookId[]
 */
export const authorToBooksRepository = new AuthorToBooksRepository(
    libraryDataBase
);
