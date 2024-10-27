import { roleMiddleware } from '../middleware/auth.middleware.js';
import { userService } from '../services/user.service.js';
import { Role } from '../enums/role.enum.js';
import express from 'express';

export const userEndpoint = express.Router();

userEndpoint.get(
    '/changeRole',
    roleMiddleware([Role.ADMIN]),
    (req, res, next) => {
        userService.pushNewUserRole(req, res).catch(next);
    }
);
