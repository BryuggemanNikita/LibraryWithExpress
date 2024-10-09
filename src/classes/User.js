export class User {
    #name;
    #email;
    #hashPassword;
    #roles;
    #id;

    constructor (name, email, hashPassword, role, id) {
        this.#name = name;
        this.#email = email;
        this.#hashPassword = hashPassword;
        this.#roles = [role];
        this.#id = id;
    }

    getPayload () {
        return {
            name: this.#name,
            email: this.#email,
            roles: this.#roles,
            id: this.#id
        };
    }

    getName () {
        return this.#name;
    }
    getEmail () {
        return this.#email;
    }
    getHashPassword () {
        return this.#hashPassword;
    }
    getRoles () {
        return this.#roles;
    }
    getId () {
        return this.#id;
    }

    pushRole (role) {
        this.#roles.push(role);
    }
}
