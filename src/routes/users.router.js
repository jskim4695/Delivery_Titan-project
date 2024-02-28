import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { UserController } from '../controllers/users.controller.js';
import { UserService } from '../services/users.service.js';
import { UserRepository } from '../repositories/users.repository.js';

const router = express.Router();

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/sign-up', userController.userSignUp);
router.post('/sign-in', userController.userSignIn);
router.get('/users/:userId', userController.getUser);
router.patch('/users/:userId', userController.editInfo);

export default router;
