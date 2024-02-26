import { beforeEach, jest } from '@jest/globals';
import { CartRepository } from '../../src/repositories/carts.repository';

let prisma = {
  $transaction: jest.fn().mockImplementation(async (tx) => {
    const operations = await tx(prisma);
    return operations;
  }),
  carts: {
    findUnique: jest.fn(),
    delete: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    findMany: jest.fn(),
  },
};

let cartRepository = new CartRepository(prisma);

describe('Cart Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  const sampleCart = {
    id: 1,
    menuId: 1,
    orderId: 1,
    quantity: 1,
    status: 'AVAILABLE',
    storeId: 1,
    userId: 1,
    createdAt: '2024-02-20T06:38:42.129Z',
    updatedAt: '2024-02-20T06:50:42.129Z',
  };

  test('getCartByUserIdNMenuId 테스트', async () => {
    // params
    const userId = 1,
      menuId = 1;
    prisma.carts.findUnique.mockReturnValue(sampleCart);
    const result = await cartRepository.getCartByUserIdNMenuId(userId, menuId);

    // 검증
    expect(result).toEqual(sampleCart);
    expect(prisma.carts.findUnique).toHaveBeenCalledTimes(1);
    expect(prisma.carts.findUnique).toHaveBeenCalledWith({
      where: { userId: +userId, menuId: +menuId },
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
    expect(prisma.carts.delete).toHaveBeenCalledTimes(1);
    expect(prisma.carts.delete).toHaveBeenCalledWith({
      where: { userId: +userId },
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
});
