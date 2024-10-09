export class Book {
    #name;
    #countPages;
    #genre;
    #authorId;
    #id;

    constructor (name, countPages, genre, authorID, id) {
        this.#name = name;
        this.#countPages = countPages;
        this.#genre = genre;
        this.#authorId = authorID;
        this.#id = id;
    }

    getPayload(){
        return {
            name: this.#name,
            countPages: this.#countPages,
            genre: this.#genre,
            authroId: this.#authorId,
            id: this.#id,
        }
    }

    getName () {
        return this.#name;
    }

    getCountPages () {
        return this.#countPages;
    }

    getGenre () {
        return this.#genre;
    }

    getAuthorID () {
        return this.#authorId;
    }

    getId () {
        return this.#id;
    }

    setName (newName) {
        this.#name = newName;
    }

    setCountPages (newCountPages) {
        this.#countPages = newCountPages;
    }

    setGenre (newGenre) {
        this.#genre = newGenre;
    }
}
