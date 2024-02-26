import express from 'express';
import { prisma } from '../utils/prisma/index.js';
import { OrderController } from '../controllers/orders.controller.js';
import { OrderService } from '../services/orders.service.js';
import { OrderRepository } from '../repositories/orders.repository.js';
import { CartRepository } from '../repositories/carts.repository.js';
import { authenticateUser } from '../middlewares/auth.middleware.js';
const router = express.Router();

const cartRepository = new CartRepository(prisma);
const orderRepository = new OrderRepository(prisma);
const orderService = new OrderService(orderRepository, cartRepository);
const orderController = new OrderController(orderService);

/** 카트로 주문하기(고객) */
router.post('/user/cart/order', authenticateUser, orderController.createOrder);

/** 주문 확인하기(사장) */
router.post('/user/order', authenticateUser, orderController.getOrders);

/** 배달 완료로 주문 상태 변경하기 (사장) */
router.update(
  '/user/order/:orderId',
  authenticateUser,
  orderController.updateStatus
);

export default router;
