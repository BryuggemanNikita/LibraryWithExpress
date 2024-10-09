import express from 'express';
import { Role } from '../enums/role.enum.js';
import { roleMiddleware } from '../middleware/auth.middleware.js';
import { userService } from '../services/user.service.js';

export const userEndpoint = express.Router();

userEndpoint.get(
    '/changeRole',
    roleMiddleware([Role.ADMIN]),
    userService.pushNewUserRole
);
