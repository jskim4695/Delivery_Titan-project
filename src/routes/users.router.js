import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
import { UserController } from '../controllers/users.controller.js';
import { UserService } from '../services/users.service.js';
import { UserRepository } from '../repositories/users.repository.js';
import { uploadProfileImg } from '../utils/multer/multer.js';

const router = express.Router();

const userRepository = new UserRepository(prisma);
const userService = new UserService(userRepository);
const userController = new UserController(userService);

router.post('/sign-up', userController.userSignUp);
router.post('/sign-in', userController.userSignIn);
router.get('/user/profile', authenticateUser, userController.getUser);
router.patch(
  '/user/profile',
  authenticateUser,
  uploadProfileImg.single('profileImage'),
  userController.editInfo
);

export default router;
