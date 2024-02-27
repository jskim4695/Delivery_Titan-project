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

  const sampleCarts = [
    {
      id: 1,
      menuId: 1,
      orderId: null,
      quantity: 1,
      status: 'AVAILABLE',
      storeId: 1,
      userId: 1,
      createdAt: '2024-02-20T06:38:42.129Z',
      updatedAt: '2024-02-20T06:50:42.129Z',
    },
    {
      id: 1,
      menuId: 2,
      orderId: 1,
      quantity: 1,
      status: 'AVAILABLE',
      storeId: 1,
      userId: 1,
      createdAt: '2024-02-20T06:38:42.129Z',
      updatedAt: '2024-02-20T06:50:42.129Z',
    },
  ];
  const sampleMenu = {
    id: 1,
    storeId: 1,
    menuName: 'menu1',
    menuInfo: 'menu1',
    price: 10000,
    menuImage: 'menu1.jpg',
  };

  test('createOrder 테스트 (정상)', async () => {
    const userId = 1;
    const address = 'Seoul hawergokdong 21';

    cartRepository.getCartsByUserId.mockResolvedValue(sampleCarts);
    cartRepository.getMenuById.mockResolvedValue(sampleMenu);
    orderRepository.getShippingFeeByStoreId.mockResolvedValue(3000);
    orderRepository.getPointById.mockResolvedValue(1000000);
    orderRepository.getAddressByUserId.mockResolvedValue(
      'Seoul hawergokdong 21'
    );
    orderRepository.createOrder.mockResolvedValue(sampleOrder);

    const result = await orderService.createOrder(userId, address);

    expect(result).toEqual(sampleOrder);
  });

  test('createOrder 테스트 by NotFoundError', async () => {
    const userId = 1;
    const address = 'Seoul hawergokdong 21';

    cartRepository.getCartsByUserId.mockResolvedValue([]);

    await expect(orderService.createOrder(userId, address)).rejects.toThrow(
      new NotFoundError('장바구니가 텅 비었어요.')
    );
  });

  test('createOrder 테스트 by ApiError', async () => {
    const userId = 1;
    const address = 'Seoul hawergokdong 21';

    cartRepository.getCartsByUserId.mockResolvedValue(sampleCarts);
    cartRepository.getMenuById.mockResolvedValue(sampleMenu);
    orderRepository.getShippingFeeByStoreId.mockResolvedValue(3000);
    orderRepository.getPointById.mockResolvedValue(0);

    await expect(orderService.createOrder(userId, address)).rejects.toThrow(
      new ApiError('포인트가 부족합니다.')
    );
  });

  test('createOrder 테스트 by BadRequestError', async () => {
    const userId = 1;
    const address = null;

    cartRepository.getCartsByUserId.mockResolvedValue(sampleCarts);
    cartRepository.getMenuById.mockResolvedValue(sampleMenu);
    orderRepository.getShippingFeeByStoreId.mockResolvedValue(3000);
    orderRepository.getPointById.mockResolvedValue(1000000);
    orderRepository.getAddressByUserId.mockResolvedValue(null);

    await expect(orderService.createOrder(userId, address)).rejects.toThrow(
      new BadRequestError('배송지를 입력해주세요.')
    );
  });

  test('getOrdersByOwnerId 테스트 (정상)', async () => {
    const ownerId = 1;
    const storeId = 1;

    orderRepository.getStoreIdByOwnerId.mockResolvedValue({ id: storeId });
    orderRepository.getOrdersByStoreId.mockResolvedValue(sampleOrders);

    const result = await orderService.getOrdersByOwnerId(ownerId);

    expect(orderRepository.getStoreIdByOwnerId).toBeCalledTimes(1);
    expect(orderRepository.getStoreIdByOwnerId).toBeCalledWith(ownerId);
    expect(orderRepository.getOrdersByStoreId).toBeCalledTimes(1);
    expect(orderRepository.getOrdersByStoreId).toBeCalledWith(storeId);
    expect(result).toEqual(sampleOrders);
  });

  test('getOrdersByOwnerId 테스트 by NotFoundError(store가 없을때)', async () => {
    const ownerId = 1;

    orderRepository.getStoreIdByOwnerId.mockResolvedValue(null);

    await expect(orderService.getOrdersByOwnerId(ownerId)).rejects.toThrow(
      new NotFoundError('존재하지 않는 가게입니다.')
    );
  });

  test('getOrdersByUserId 테스트 (정상)', async () => {
    const userId = 1;

    orderRepository.getOrdersByUserId.mockResolvedValue(sampleOrders);

    const result = await orderService.getOrdersByUserId(userId);

    expect(orderRepository.getOrdersByUserId).toBeCalledTimes(1);
    expect(orderRepository.getOrdersByUserId).toBeCalledWith(userId);
    expect(result).toEqual(sampleOrders);
  });

  const resultOrder = {
    id: 1,
    storeId: 1,
    userId: 1,
    address: 'Seoul Seongworgokdong 21',
    totalPrice: 34000,
    status: 'DELIVERY_COMPLETE',
    createdAt: '2024-02-25T06:38:42.129Z',
    updatedAt: '2024-02-25T07:38:42.129Z',
  };

  test('updateStatus 테스트 (정상)', async () => {
    const orderId = 1;
    const status = 'DELIVERY_COMPLETE';

    orderRepository.getOrderById.mockResolvedValue(sampleOrder);
    orderRepository.updateStatus.mockResolvedValue(resultOrder);

    const result = await orderService.updateStatus(orderId, status);

    expect(result).toEqual(resultOrder);
  });

  test('updateStatus 테스트 by NotFoundError (주문이 존재하지 않을때)', async () => {
    const orderId = 1;
    const status = 'DELIVERY_COMPLETE';

    orderRepository.getOrderById.mockResolvedValue(null);

    await expect(orderService.updateStatus(orderId, status)).rejects.toThrow(
      new NotFoundError('해당 주문이 존재하지 않습니다.')
    );
  });

  test('updateStatus 테스트 by BadRequestError (입력된 상태가 잘못됬을때)', async () => {
    const orderId = 1;
    const status = 'YO';

    orderRepository.getOrderById.mockResolvedValue(sampleOrder);

    await expect(orderService.updateStatus(orderId, status)).rejects.toThrow(
      new BadRequestError('잘못된 상태입니다.')
    );
  });
});
