import Datastore from 'nedb';

const booksDataBase = new Datastore({
    filename: '../dataBases/books'
});

/**
 * Репозиторий книг в библиотеке
 * @method getBooks () : book[]
 * @method getBooksPayload () : bookPayload[]
 * @method addBook (payload) : newBook
 * @method deleteBook (payload) : {flag, message}
 */
class BooksRepository {
    #booksDataBase;

    constructor (booksDataBase) {
        booksDataBase.loadDatabase();
        this.#booksDataBase = booksDataBase;
    }

    /**
     * @returns копию массива из объектов класса Book в DB
     */
    getBooks () {
        return new Promise(res => {
            this.#booksDataBase.find({}, (err, docs) => {
                res(docs);
            });
        });
    }

    /**
     * Создает и добавляет книгу в DB
     * @param {*} payload.name - название книги
     * @param {*} payload.countPages - количесвто страниц
     * @param {*} payload.genre - жанр книги
     * @returns book - объект добавленной книги
     */
    addBook (payload) {
        return new Promise(res => {
            this.#booksDataBase.insert({ ...payload }, (err, docs) => {
                res(docs);
            });
        });
    }

    /**
     * Удаляет книгу из DB
     * @param {*} bookId id книги
     * @returns результат операции : book | undefined
     */
    deleteBook (bookId) {
        return new Promise(res => {
            this.#booksDataBase.remove({ _id: bookId }, (err, docs) => {
                this.#booksDataBase.loadDatabase();
                res(docs);
            });
        });
    }

    /**
     * Поиск книги в бд по заданному id
     * @param {*} bookId - id искомой книги
     * @returns экземпляр класса Book
     */
    getById (bookId) {
        return new Promise(res => {
            this.#booksDataBase.find({ _id: bookId }, (err, docs) => {
                res(docs[0]);
            });
        });
    }

    /**
     * Поиск книг по совпадениям в названии | подстроке
     * @param {*} findName - искомое название | подстрока
     * @returns массив авторов(payload)
     */
    getByRegExp (name) {
        return new Promise(res => {
            const regular = new RegExp(`(${name})`);
            this.#booksDataBase.find({ name: regular }, (err, docs) => {
                res(docs);
            });
        });
    }
}

/**
 * Репозиторий книг в библиотеке
 * @method getBooks() : book[]
 * @method getBooksPayload() : bookPayload[]
 * @method addBook(payload) : newBook
 * @method deleteBook(payload) : {flag, message}
 */
export const booksRepository = new BooksRepository(booksDataBase);
