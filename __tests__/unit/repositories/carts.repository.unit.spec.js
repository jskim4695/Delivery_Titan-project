import { beforeEach, jest } from '@jest/globals';
import { CartRepository } from '../../../src/repositories/carts.repository';

let prisma = {
  $transaction: jest.fn(),
  carts: {
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
  menu: {
    findUnique: jest.fn(),
  },
  stores: {
    findUnique: jest.fn(),
  },
};

let cartRepository = new CartRepository(prisma);

describe('Cart Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.spyOn(prisma, '$transaction').mockImplementation((callback) => {
      return callback(prisma);
    });
  });

  const sampleCart = {
    id: 1,
    menuId: 1,
    orderId: null,
    quantity: 1,
    status: 'AVAILABLE',
    storeId: 1,
    userId: 1,
    createdAt: '2024-02-20T06:38:42.129Z',
    updatedAt: '2024-02-20T06:50:42.129Z',
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

  test('getCartByUserId 테스트', async () => {
    // params
    const userId = 1;

    prisma.carts.findFirst.mockReturnValue(sampleCart);
    const result = await cartRepository.getCartByUserId(userId);

    // 검증
    expect(result).toEqual(sampleCart);
    expect(prisma.carts.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.carts.findFirst).toHaveBeenCalledWith({
      where: { userId: +userId, status: 'AVAILABLE' },
    });
  });

  test('createCart 테스트', async () => {
    // params
    const storeId = 1,
      menuId = 1,
      userId = 1;

    prisma.carts.create.mockReturnValue(sampleCart);

    const result = await cartRepository.createCart(storeId, menuId, userId);

    // 검증
    expect(result).toEqual(sampleCart);
    expect(prisma.carts.create).toHaveBeenCalledTimes(1);
    expect(prisma.carts.create).toHaveBeenCalledWith({
      data: {
        menuId: +menuId,
        storeId: +storeId,
        userId: +userId,
      },
    });
  });

  test('deleteNcreateCart 테스트', async () => {
    // params
    const storeId = 1,
      menuId = 1,
      userId = 1,
      cartId = 1;
    prisma.carts.create.mockReturnValue(sampleCart);
    const result = await cartRepository.deleteNcreateCart(
      storeId,
      menuId,
      userId,
      cartId
    );
    // 검증
    expect(result).toEqual(sampleCart);
    expect(prisma.carts.delete).toHaveBeenCalledTimes(1);
    expect(prisma.carts.delete).toHaveBeenCalledWith({
      where: { id: +cartId },
    });
    expect(prisma.carts.create).toHaveBeenCalledTimes(1);
    expect(prisma.carts.create).toHaveBeenCalledWith({
      data: {
        menuId: +menuId,
        storeId: +storeId,
        userId: +userId,
      },
    });
  });

  test('updateCart 테스트', async () => {
    const cartId = 1,
      quantity = 3;
    prisma.carts.update.mockReturnValue(sampleCart);
    const result = await cartRepository.updateCart(cartId, quantity);
    // 검증
    expect(result).toEqual(sampleCart);
    expect(prisma.carts.update).toHaveBeenCalledTimes(1);
    expect(prisma.carts.update).toHaveBeenCalledWith({
      where: { id: +cartId },
      data: { quantity: +quantity },
    });
  });

  test('getCartByUserIdNMenuId 테스트', async () => {
    // params
    const userId = 1,
      menuId = 1;
    prisma.carts.findFirst.mockReturnValue(sampleCart);
    const result = await cartRepository.getCartByUserIdNMenuId(userId, menuId);

    // 검증
    expect(result).toEqual(sampleCart);
    expect(prisma.carts.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.carts.findFirst).toHaveBeenCalledWith({
      where: { userId: +userId, menuId: +menuId },
    });
  });

  test('getCartsByUserId 테스트', async () => {
    // params
    const userId = 1;

    prisma.carts.findMany.mockReturnValue(sampleCarts);
    const result = await cartRepository.getCartsByUserId(userId);

    // 검증
    expect(result).toEqual(sampleCarts);
    expect(prisma.carts.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.carts.findMany).toHaveBeenCalledWith({
      where: { userId: +userId, status: 'AVAILABLE' },
    });
  });

  test('getMenuById 테스트', async () => {
    // params
    const menuId = 1;
    const sampleMenu = {
      id: 1,
      storeId: 1,
      menuName: 'Fried Chicken',
      menuInfo: 'Crispy and juicy',
      price: 15000,
      menuImage: 'friedChicken.jpg',
    };

    prisma.menu.findUnique.mockReturnValue(sampleMenu);
    const result = await cartRepository.getMenuById(menuId);

    // 검증
    expect(result).toEqual(sampleMenu);
    expect(prisma.menu.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.menu.findUnique).toHaveBeenCalledWith({
      where: { id: +menuId },
    });
  });

  test('getStoreNameById 테스트', async () => {
    // params
    const storeId = 1;
    const sampleStoreName = {
      storeName: 'Lee Chicken',
    };

    prisma.stores.findUnique.mockReturnValue(sampleStoreName);
    const result = await cartRepository.getStoreNameById(storeId);

    // 검증
    expect(result).toEqual(sampleStoreName);
    expect(prisma.stores.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.stores.findUnique).toHaveBeenCalledWith({
      where: { id: +storeId },
      select: { storeName: true },
    });
  });

  test('deleteCartById 테스트', async () => {
    // params
    const cartId = 1;

    await cartRepository.deleteCartById(cartId);
    // 검증
    expect(prisma.carts.delete).toHaveBeenCalledTimes(1);
    expect(prisma.carts.delete).toHaveBeenCalledWith({
      where: { id: +cartId },
    });
  });
});
