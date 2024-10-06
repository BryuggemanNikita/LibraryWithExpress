import express from 'express';
import { userService } from '../services/auth.service.js';
import { roleMiddleware } from '../middleware/auth.middleware.js';
import { Role } from '../enums/role.enum.js';
import { IsEmptyStr } from '../stringTests/IsEmpty.js';

export const userEndpoint = express.Router();

userEndpoint.get(
    '/changeRole',
    roleMiddleware([Role.ADMIN]),
    async (req, res) => {
        const userId = parseInt(req.body.id);
        const roleId = parseInt(req.body.newRole);

        if (isNaN(userId)) {
            return res.status(400).json({ message: 'Неверно введен id' });
        }
        if (isNaN(roleId)) {
            return res.status(400).json({ message: 'Неверно введена роль' });
        }

        let newRole;
        for (let key in Role) {
            if (Role[key] == roleId) {
                newRole = Role[key];
            }
        }
        if (newRole == undefined) {
            return res.status(400).json({ message: 'роль не определена' });
        }

        const result = await userService.changeUserRole(userId, newRole);
        if (!result.flag) {
            return res.status(400).json({ message: result.message });
        }
        return res.status(200).json({ message: result.message });
    }
);
