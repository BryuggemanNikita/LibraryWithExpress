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
    #library;

    constructor () {
        this.#library = new Map();
    }

    /**
     * Надо исправить на копию
     * @returns Библиотеку
     */
    async getLibrary () {
        return this.#library;
    }

    /**
     * Создает нового автора в репозиторий
     * @param {*} authorID - id ноавого автора
     */
    async addNewAuthorInLibrary (authorID) {
        this.#library.set(authorID, []);
    }

    /**
     * Добавляет книгу в репозиторий
     * @param {*} bookPayload - payload объекта класса Book
     * @param {*} authorID - id автора который
     * @returns наличие автора в библиотеке
     */
    async addBook (book, authorID) {
        const authorLibrary = this.#library.get(authorID);
        if (!authorLibrary) {
            return false;
        }
        authorLibrary.push(book);
        return true;
    }

    /**
     * Удаляет книгу из репозитория
     * @param {*} bookID -
     * @param {*} authorID
     * @returns наличие автора в бд --> успешность результата
     */
    async deleteBy2ID (bookID, authorID) {
        const authorLibrary = this.#library.get(authorID);
        if (!authorLibrary) {
            return false;
        }
        let newLib = authorLibrary.filter(book => book.getId() !== bookID);
        this.#library.set(authorID, newLib);
        return true;
    }

    /**
     * Удаляет автора из репозитория
     * @param {*} authorID - id искомого автора
     * @returns массив из id книг, которые нужно удалить из системы
     */
    async deleteAuthorLibrary (authorID) {
        const authorLibrary = this.#library.get(authorID);
        const bookIDs = authorLibrary.map(book => (book = book.getId()));
        this.#library.delete(authorID);
        return bookIDs;
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
export const libraryDB = new LibraryDataBase();
