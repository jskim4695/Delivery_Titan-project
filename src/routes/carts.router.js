import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { CartController } from '../controllers/carts.controller.js';
import { CartService } from '../services/carts.service.js';
import { CartRepository } from '../repositories/carts.repository.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
const router = express.Router();

const cartRepository = new CartRepository(prisma);
const cartService = new CartService(cartRepository);
const cartController = new CartController(cartService);

/** 카트에 담기 */
router.post(
  '/main/store/:storeId/:menuId/cart',
  authenticateUser,
  cartController.addToCart
);

/** 카트의 메뉴 수량 변경 */
router.patch(
  '/main/store/:storeId/:menuId/cart',
  authenticateUser,
  cartController.updateQuantity
);

/** 내 카트 조회 */
router.get('/user/cart', authenticateUser, cartController.getCart);

/** 카트에서 삭제 */
router.delete(
  '/user/cart/:menuId',
  authenticateUser,
  cartController.deleteMenu
);

export default router;
