import express from "express";
import { prisma } from "../utils/prisma/index.js";
import { AuthController } from "../controllers/auth.controller.js";
import { AuthService } from "../services/auth.service.js";
import { UserRepository } from "../repositories/users.repository.js";

const router = express.Router();

const userRepository = new UserRepository(prisma);
const authService = new AuthService(userRepository);
const authController = new AuthController(authService);

router.post("/token", authController.generateAccessToken);

export default router;
