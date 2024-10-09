import { libraryDB } from '../localDataBase/library.db.js';

/**
 * Класс с методами, реализующий фильтрацию библиотеки
 * @method getById(authorId) : user[] | undefined
 */
class LibraryFilter {
    /**
     * Возвращает массив из pyaload книг автора
     * @param {*} authorId - id искомого автора
     * @returns user[] | undefined
     */
    async getById (authorId) {
        const library = await libraryDB.getLibrary();        
        return library.get(authorId);
    }
}

/**
 * Экземпляр класса, реализующий фильтрацию библиотеки
 * @method getById(authorId) : user[] | undefined
 */
export const libraryFilter = new LibraryFilter()