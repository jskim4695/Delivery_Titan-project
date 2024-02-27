import { expect, jest } from '@jest/globals';
import { OrderService } from '../../../src/services/orders.service';
import {
  NotFoundError,
  BadRequestError,
  ApiError,
} from '../../../src/middlewares/error-handling.middleware';

let orderRepository = {
  getAddressByUserId: jest.fn(),
  createOrder: jest.fn(),
  getPointById: jest.fn(),
  getStoreIdByOwnerId: jest.fn(),
  getShippingFeeByStoreId: jest.fn(),
  getOrdersByStoreId: jest.fn(),
  getOrdersByUserId: jest.fn(),
  getOrderById: jest.fn(),
  updateStatus: jest.fn(),
};

let cartRepository = {
  getCartsByUserId: jest.fn(),
  getMenuById: jest.fn(),
};

let orderService = new OrderService(orderRepository, cartRepository);

describe('Order Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });
});
