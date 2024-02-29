import { beforeEach, jest } from '@jest/globals';
import { OrderRepository } from '../../../src/repositories/orders.repository';

let prisma = {
  $transaction: jest.fn(),
  orders: {
    findUnique: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
  },
  users: {
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  carts: {
    updateMany: jest.fn(),
    findMany: jest.fn(),
  },
  stores: {
    update: jest.fn(),
    findUnique: jest.fn(),
  },
  menu: {
    findUnique: jest.fn(),
  },
};

let orderRepository = new OrderRepository(prisma);

describe('Order Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(prisma, '$transaction').mockImplementation((callback) => {
      return callback(prisma);
    });
  });

  test('getAddressByUserId 테스트 (정상)', async () => {
    const userId = 1;
    const address = 'Seoul Seongworgokdong 21';

    prisma.users.findUnique.mockResolvedValue({
      address,
    });

    const result = await orderRepository.getAddressByUserId(userId);
    expect(result).toEqual(address);
  });

  test('getAddressByUserId 테스트 (사용자 정보에 address가 없을때)', async () => {
    const userId = 1;

    prisma.users.findUnique.mockResolvedValue({ address: null });

    const result = await orderRepository.getAddressByUserId(userId);
    expect(result).toEqual(null);
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

  test('createOrderByCart 테스트 (정상)', async () => {
    const userId = 1;
    const address = 'Seoul Seongworgokdong 21';

    prisma.$transaction.mockResolvedValue(sampleOrder);

    const result = await orderRepository.createOrderByCart(
      sampleCarts,
      userId,
      address
    );

    expect(result).toEqual(sampleOrder);
    expect(prisma.$transaction).toHaveBeenCalled();
  });

  test('createOrderByCart 테스트 (transaction 실패)', async () => {
    const userId = 1;
    const address = 'Seoul Seongworgokdong 21';
    const mockError = new Error('transaction 실패');
    prisma.$transaction.mockRejectedValue(mockError);

    await expect(
      orderRepository.createOrderByCart(sampleCarts, userId, address)
    ).rejects.toThrow(mockError);
  });

  test('getPointById 테스트 (정상)', async () => {
    const userId = 1;
    const point = 100000;

    prisma.users.findUnique.mockResolvedValue({
      point,
    });

    const result = await orderRepository.getPointById(userId);
    expect(result).toEqual(point);
  });

  test('getStoreIdByOwnerId 테스트 (정상)', async () => {
    const ownerId = 2;
    const storeId = 1;

    prisma.stores.findUnique.mockResolvedValue({ id: storeId });

    const result = await orderRepository.getStoreIdByOwnerId(ownerId);
    expect(result).toEqual({ id: storeId });
  });

  test('getShippingFeeByStoreId 테스트 (정상)', async () => {
    const storeId = 1;
    const shippingFee = 3000;

    prisma.stores.findUnique.mockResolvedValue({ shippingFee });

    const result = await orderRepository.getShippingFeeByStoreId(storeId);
    expect(result).toEqual(shippingFee);
  });

  test('getOrdersByStoreId 테스트 (정상)', async () => {
    const storeId = 1;
    const sampleOrders = [
      {
        id: 1,
        address: 'Seoul Seongworgokdong 22',
        status: 'ORDER_COMPLETE',
        menuList: [
          {
            menuImage: 'menu1',
            menuName: 'menu1',
            price: 10000,
            quantity: 2,
          },
        ],
      },
    ];
    prisma.orders.findMany.mockResolvedValue(sampleOrders);
    prisma.carts.findMany.mockResolvedValue(sampleOrders[0].menuList);
    prisma.menu.findUnique.mockResolvedValue(sampleOrders[0].menuList[0]);

    const result = await orderRepository.getOrdersByStoreId(storeId);

    expect(result).toEqual(sampleOrders);
  });

  test('getOrdersByUserId 테스트 (정상)', async () => {
    const userId = 1;
    const sampleOrders = [
      {
        id: 1,
        address: 'Seoul Seongworgokdong 22',
        status: 'ORDER_COMPLETE',
        menuList: [
          {
            menuImage: 'menu1',
            menuName: 'menu1',
            price: 10000,
            quantity: 2,
          },
        ],
      },
    ];
    prisma.orders.findMany.mockResolvedValue(sampleOrders);
    prisma.carts.findMany.mockResolvedValue(sampleOrders[0].menuList);
    prisma.menu.findUnique.mockResolvedValue(sampleOrders[0].menuList[0]);

    const result = await orderRepository.getOrdersByUserId(userId);

    expect(result).toEqual(sampleOrders);
  });

  test('getOrderById 테스트 (정상)', async () => {
    const orderId = 1;
    prisma.orders.findUnique.mockResolvedValue(sampleOrder);
    const result = await orderRepository.getOrderById(orderId);
    expect(result).toEqual(sampleOrder);
  });

  test('updateStatus 테스트 (정상)', async () => {
    const orderId = 1;
    const status = 'DELIVERY_COMPLETE';
    const resultOrder = { ...sampleOrder, status };
    prisma.orders.update.mockResolvedValue(resultOrder);

    const result = await orderRepository.updateStatus(orderId, status);

    expect(result).toEqual(resultOrder);
  });

  test('createOrderByMenu 테스트 (정상)', async () => {
    const userId = 1;
    const storeId = 1;
    const totalPrice = 34000;
    const address = 'Seoul Seongworgokdong 21';

    prisma.$transaction.mockResolvedValue(sampleOrder);

    const result = await orderRepository.createOrderByMenu(
      userId,
      storeId,
      totalPrice,
      address
    );

    expect(result).toEqual(sampleOrder);
    expect(prisma.$transaction).toHaveBeenCalled();
  });
});
