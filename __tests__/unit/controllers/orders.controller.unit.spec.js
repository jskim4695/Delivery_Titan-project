import { jest } from '@jest/globals';
import { OrderController } from '../../../src/controllers/orders.controller';

let orderService = {
  createOrder: jest.fn(),
  getOrdersByOwnerId: jest.fn(),
  getOrdersByUserId: jest.fn(),
  updateStatus: jest.fn(),
};

let orderController = new OrderController(orderService);

describe('Order Controller Unit Test', () => {
  let req, res, next;

  beforeEach(() => {
    jest.resetAllMocks();
    req = {
      params: { orderId: 1 },
      body: { address: 'Seoul Haworgokdong 22', status: 'DELIVERY_COMPLETE' },
      userId: 1,
      role: 'CUSTOMER',
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
  });

  const sampleOrder = {
    id: 1,
    storeId: 1,
    userId: 1,
    address: 'Seoul Seongworgokdong 21',
    totalPrice: 34000,
    status: 'ORDER_COMPLETE',
    createdAt: '2024-02-25T06:38:42.129Z',
    updatedAt: '2024-02-25T06:38:42.129Z',
  };

  const sampleOrders = [
    {
      id: 1,
      storeId: 1,
      userId: 1,
      address: 'Seoul Seongworgokdong 21',
      totalPrice: 34000,
      status: 'ORDER_COMPLETE',
      createdAt: '2024-02-25T06:38:42.129Z',
      updatedAt: '2024-02-25T06:38:42.129Z',
    },
    {
      id: 2,
      storeId: 1,
      userId: 2,
      address: 'Seoul Haworgokdong 22',
      totalPrice: 50000,
      status: 'ORDER_COMPLETE',
      createdAt: '2024-02-26T06:38:42.129Z',
      updatedAt: '2024-02-26T06:38:42.129Z',
    },
  ];

  test('createOrder 테스트 (정상)', async () => {
    orderService.createOrder.mockResolvedValue(sampleOrder);

    await orderController.createOrder(req, res, next);

    expect(orderService.createOrder).toHaveBeenCalledWith(
      req.userId,
      req.body.address
    );
    expect(orderService.createOrder).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith({ order: sampleOrder });
  });

  test('createOrder 테스트 (실패)', async () => {
    const mockError = new Error('주문 생성 실패');

    orderService.createOrder.mockRejectedValue(mockError);

    await orderController.createOrder(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });

  test('getOrders 테스트 (고객이 본인의 주문목록 확인할 때)', async () => {
    orderService.getOrdersByUserId.mockResolvedValue(sampleOrders);

    await orderController.getOrders(req, res, next);

    expect(orderService.getOrdersByUserId).toHaveBeenCalledWith(req.userId);
    expect(orderService.getOrdersByUserId).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ orders: sampleOrders });
  });

  test('getOrders 테스트 (사장이 주문목록 확인할 때)', async () => {
    req.role = 'OWNER';

    orderService.getOrdersByOwnerId.mockResolvedValue(sampleOrders);

    await orderController.getOrders(req, res, next);

    expect(orderService.getOrdersByOwnerId).toHaveBeenCalledWith(req.userId);
    expect(orderService.getOrdersByOwnerId).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ orders: sampleOrders });
  });

  test('getOrders 테스트 (실패)', async () => {
    const mockError = new Error('주문 조회 실패');

    orderService.getOrdersByUserId.mockRejectedValue(mockError);

    await orderController.getOrders(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });

  test('updateStatus 테스트 (정상)', async () => {
    orderService.updateStatus.mockResolvedValue(sampleOrder);

    await orderController.updateStatus(req, res, next);

    expect(orderService.updateStatus).toHaveBeenCalledWith(
      req.params.orderId,
      req.body.status
    );
    expect(orderService.updateStatus).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ order: sampleOrder });
  });

  test('updateStatus 테스트 (실패)', async () => {
    const mockError = new Error('주문 상태 변경 실패');

    orderService.updateStatus.mockRejectedValue(mockError);

    await orderController.updateStatus(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
