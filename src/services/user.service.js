import { User } from '../classes/User.js';
import { Role } from '../enums/role.enum.js';
import bcrypt from 'bcrypt';

export class UserService {
    static ID = 0;
    constructor () {
        this.users = new Set();

        const adminHashPassword = bcrypt.hashSync('LibraryAdmin', 7);
        const admin = new User(
            'admin',
            null,
            adminHashPassword,
            Role.ADMIN,
            UserService.ID
        );
        UserService.ID++;
        this.users.add(admin);
    }

    async pushNewUser (name, email, hashPassword, role) {
        const user = new User(name, email, hashPassword, role, UserService.ID);
        if (await this.hasDublicateEmail(email)) {
            return {
                message: 'Пользователь с такой почтой уже существует',
                flag: false
            };
        }
        if (await this.hasDublicateName(name)) {
            return {
                message: 'Пользователь с таким именем уже существует',
                flag: false
            };
        }
        this.users.add(user);
        UserService.ID++;
        return {
            message: 'Пользователь успешно зарегистрирован',
            flag: true
        };
    }

    async hasDublicateEmail (email) {
        for (let user of this.users) {
            if (user.getEmail() === email) return true;
        }
        return false;
    }

    async hasDublicateName (name) {
        for (let user of this.users) {
            if (user.getName() === name) return true;
        }
        return false;
    }

    async getAllUsers () {
        const users = [];

        this.users.forEach(e => {
            const user = {
                name: e.getName(),
                email: e.getEmail(),
                roles: e.getRoles(),
                id: e.getId()
            };
            users.push(user);
        });
        return users;
    }

    getUserByEmail (email) {
        let user;
        for (user of this.users) {
            if (user.getEmail() == email) {
                return user;
            }
        }
    }
    getUserByName (name) {
        let user;
        for (user of this.users) {
            if (user.getName() == name) {
                return user;
            }
        }
    }
}
