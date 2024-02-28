import { expect, jest } from '@jest/globals';
import { OrderController } from '../../../src/controllers/orders.controller';

let orderService = {
  createOrder: jest.fn(),
  getOrdersByOwnerId: jest.fn(),
  getOrdersByUserId: jest.fn(),
  updateStatus: jest.fn(),
};

const req = {
  body: jest.fn(),
};

const res = {
  status: jest.fn(),
  json: jest.fn(),
};

const next = jest.fn();

let orderController = new OrderController(orderService);

describe('Order Controller Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    res.status.mockReturnValue(res);
  });

  test('createOrder 테스트 (정상)', async () => {
    req.userId = 1;
    req.role = 'CUSTOMER';
    req.body = { address: 'Seoul' };

    const sampleOrder = {
      id: 1,
      storeId: 1,
      userId: 1,
      address: 'Seoul',
      totalPrice: 34000,
      status: 'ORDER_COMPLETE',
      createdAt: '2024-02-25T06:38:42.129Z',
      updatedAt: '2024-02-25T06:38:42.129Z',
    };

    orderService.createOrder.mockResolvedValue(sampleOrder);

    await orderController.createOrder(req, res, next);

    expect(orderService.createOrder).toHaveBeenCalledTimes(1);
    expect(orderService.createOrder).toHaveBeenCalledWith(
      req.userId,
      req.body.address
    );
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ order: sampleOrder });
  });

  test('getOrders 테스트 (고객이 본인의 주문목록 확인할 때)', async () => {
    req.userId = 1;
    req.role = 'CUSTOMER';
    req.body = { address: 'Seoul' };
    const sampleOrders = [
      {
        id: 1,
        storeId: 1,
        userId: 1,
        address: 'Seoul',
        totalPrice: 34000,
        status: 'ORDER_COMPLETE',
        createdAt: '2024-02-25T06:38:42.129Z',
        updatedAt: '2024-02-25T06:38:42.129Z',
      },
      {
        id: 2,
        storeId: 2,
        userId: 1,
        address: 'Seoul',
        totalPrice: 13000,
        status: 'ORDER_COMPLETE',
        createdAt: '2024-02-26T06:38:42.129Z',
        updatedAt: '2024-02-26T06:38:42.129Z',
      },
    ];

    orderService.getOrdersByUserId.mockResolvedValue(sampleOrders);

    await orderController.getOrders(req, res, next);

    expect(orderService.getOrdersByUserId).toHaveBeenCalledTimes(1);
    expect(orderService.getOrdersByUserId).toHaveBeenCalledWith(req.userId);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ orders: sampleOrders });
  });

  test('getOrders 테스트 (사장이 주문목록 확인할 때)', async () => {
    req.userId = 2;
    req.role = 'OWNER';
    const sampleOrders = [
      {
        id: 1,
        storeId: 1,
        userId: 1,
        address: 'Seoul',
        totalPrice: 34000,
        status: 'ORDER_COMPLETE',
        createdAt: '2024-02-25T06:38:42.129Z',
        updatedAt: '2024-02-25T06:38:42.129Z',
      },
      {
        id: 3,
        storeId: 1,
        userId: 3,
        address: 'Busan',
        totalPrice: 24000,
        status: 'ORDER_COMPLETE',
        createdAt: '2024-02-25T06:40:42.129Z',
        updatedAt: '2024-02-25T06:40:42.129Z',
      },
    ];
    orderService.getOrdersByOwnerId.mockResolvedValue(sampleOrders);

    await orderController.getOrders(req, res, next);

    expect(orderService.getOrdersByOwnerId).toHaveBeenCalledTimes(1);
    expect(orderService.getOrdersByOwnerId).toHaveBeenCalledWith(req.userId);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ orders: sampleOrders });
  });

  test('updateStatus 테스트 (정상)', async () => {
    req.params = { orderId: 1 };
    req.body = { status: 'DELIVERY_COMPLETE' };
    const sampleOrder = {
      id: 1,
      storeId: 1,
      userId: 1,
      address: 'Seoul',
      totalPrice: 34000,
      status: 'ORDER_COMPLETE',
      createdAt: '2024-02-25T06:38:42.129Z',
      updatedAt: '2024-02-25T06:38:42.129Z',
    };

    orderService.updateStatus.mockResolvedValue(sampleOrder);

    await orderController.updateStatus(req, res, next);

    expect(orderService.updateStatus).toHaveBeenCalledTimes(1);
    expect(orderService.updateStatus).toHaveBeenCalledWith(
      req.params.orderId,
      req.body.status
    );
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ order: sampleOrder });
  });
});
