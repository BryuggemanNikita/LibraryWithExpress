import Datastore from 'nedb';

const booksDataBase = new Datastore({
    filename: '../dataBases/books'
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
    #booksDataBase;

    constructor (booksDataBase) {
        booksDataBase.loadDatabase();
        this.#booksDataBase = booksDataBase;
    }

    /**
     * Возвращает все книги
     * @returns все книги из бд
     */
    getBooks () {
        return new Promise(res => {
            this.#booksDataBase.find({}, (err, docs) => {
                res(docs);
            });
        });
    }

    /**
     * Поиск книг в бд по фильтру
     * @param {*} payload - (name?, genre?, countPages?)
     * @returns книги по фильтру
     */
    getBooksByFilter (payload) {
        return new Promise(res => {
            this.#booksDataBase.find({ ...payload }, (err, docs) => {
                res(docs);
            });
        });
    }

    /**
     * Поиск книги в бд по заданному id
     * @param {*} bookId - id искомой книги
     * @returns объект книги
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
     * @returns массив книг по совпадению
     */
    getByRegExp (name) {
        return new Promise(res => {
            const regular = new RegExp(`(${name})`);
            this.#booksDataBase.find({ name: regular }, (err, docs) => {
                res(docs);
            });
        });
    }

    /**
     * Создает и добавляет книгу в бд
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
     * Обновление информации о книге
     * @param {*} bookId - id книги
     * @param {*} payload - параметры которые можно обновить (name?, genre?, countPages?)
     * @returns
     */
    updateBookInfo (bookId, payload) {
        return new Promise(res => {
            this.#booksDataBase.update(
                { _id: bookId },
                { $set: { ...payload } },
                {},
                (err, docs) => {
                    this.#booksDataBase.loadDatabase();
                    res(docs);
                }
            );
        });
    }

    /**
     * Удаляет книгу из бд
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
