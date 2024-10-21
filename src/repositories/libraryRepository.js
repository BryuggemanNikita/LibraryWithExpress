import Datastore from 'nedb';

/**
 * Репозиторий авторов и их книг
 * @method getLibrary() : book[]
 * @ реализовать payload library
 * @method addNewAuthorInLibrary (authorID) :
 * @method addBook (book, authorID) : boolean
 * @method deleteBy2ID (bookID, authorID) : boolean
 * @method deleteAuthorLibrary (authorID) : bookId[]
 */
class LibraryDataBase {
    #libraryDataBase;

    constructor () {
        const libraryDataBase = new Datastore({
            filename: '../dataBases/library'
        });
        libraryDataBase.loadDatabase();
        this.#libraryDataBase = libraryDataBase;
    }

    /**
     * Полное содержание библиотеки [авторId -> книгаId]
     * @returns Библиотеку
     */
    getLibrary () {
        return new Promise(res => {
            this.#libraryDataBase.find({}, (err, docs) => {
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
            this.#libraryDataBase.find({ authorId }, (err, docs) => {
                res(docs);
            });
        });
    }

    /**
     * Добавляет книгу в репозиторий
     * @param {*} bookPayload - payload объекта класса Book
     * @param {*} authorID - id автора который
     * @returns наличие автора в библиотеке
     */
    addBook (bookId, authorId) {
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
    async deleteBookById (bookId) {
        return new Promise(res => {
            this.#libraryDataBase.remove({ bookId }, (err, docs) => {
                this.#libraryDataBase.loadDatabase();
                res(docs);
            });
        });
    }

    // /**
    //  * Удаляет автора из репозитория
    //  * @param {*} authorID - id искомого автора
    //  * @returns массив из id книг, которые нужно удалить из системы
    //  */
    // async deleteAuthorLibrary (authorId) {
    //     const authorLibrary = this.#library.get(authorID);
    //     const bookIDs = authorLibrary.map(book => (book = book.getId()));
    //     this.#library.delete(authorID);
    //     return bookIDs;
    // }
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
export const libraryRepository = new LibraryDataBase();
