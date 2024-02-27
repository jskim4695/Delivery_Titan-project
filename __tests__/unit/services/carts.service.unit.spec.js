import { expect, jest } from '@jest/globals';
import { CartService } from '../../../src/services/carts.service';
import {
  NotFoundError,
  BadRequestError,
} from '../../../src/middlewares/error-handling.middleware';

let cartRepository = {
  getCartByUserId: jest.fn(),
  createCart: jest.fn(),
  deleteNcreateCart: jest.fn(),
  updateCart: jest.fn(),
  getCartByUserIdNMenuId: jest.fn(),
  getCartsByUserId: jest.fn(),
  getMenuById: jest.fn(),
  getStoreNameById: jest.fn(),
  deleteCartById: jest.fn(),
};

let cartService = new CartService(cartRepository);

describe('Cart Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
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

  test('addToCart 테스트 by NotFoundError', async () => {
    const storeId = 1;
    const menuId = 1;
    const userId = 1;

    const sampleMenu = {
      id: 1,
      storeId: 2,
      menuName: 'Fried Chicken',
      menuInfo: 'Crispy and juicy',
      price: 15000,
      menuImage: 'friedChicken.jpg',
    };

    cartRepository.getMenuById.mockResolvedValue(sampleMenu);

    await expect(
      cartService.addToCart(storeId, menuId, userId)
    ).rejects.toThrow(
      new NotFoundError(
        '해당 가게에는 존재하지 않는 메뉴입니다. 다른 메뉴 아이디를 입력해주세요.'
      )
    );
  });

  test('addToCart 테스트(고객의 카트가 존재하지 않을 때)', async () => {
    const storeId = 1;
    const menuId = 1;
    const userId = 1;

    const sampleMenu = {
      id: 1,
      storeId: 1,
      menuName: 'menu1',
      menuInfo: 'menu1',
      price: 15000,
      menuImage: 'menu1.jpg',
    };

    cartRepository.getMenuById.mockResolvedValue(sampleMenu);
    cartRepository.getCartByUserId.mockResolvedValue(null);
    cartRepository.createCart.mockResolvedValue(sampleCart);

    const result = await cartService.addToCart(storeId, menuId, userId);
    expect(result).toEqual(sampleCart);
    expect(cartRepository.createCart).toHaveBeenCalledWith(
      storeId,
      menuId,
      userId
    );
  });

  test('addToCart 테스트(고객의 기존 카트의 storeId가 새로 추가하려는 menu의 storeId와 다를 때)', async () => {
    const storeId = 2;
    const menuId = 2;
    const userId = 1;
    const cartId = 1;

    const sampleMenu = {
      id: 2,
      storeId: 2,
      menuName: 'menu2',
      menuInfo: 'menu2',
      price: 10000,
      menuImage: 'menu2.jpg',
    };

    const resultCart = {
      id: 2,
      menuId: 2,
      orderId: null,
      quantity: 1,
      status: 'AVAILABLE',
      storeId: 2,
      userId: 1,
      createdAt: '2024-02-21T06:38:42.129Z',
      updatedAt: '2024-02-21T06:50:42.129Z',
    };

    cartRepository.getMenuById.mockResolvedValue(sampleMenu);
    cartRepository.getCartByUserId.mockResolvedValue(sampleCart);
    cartRepository.deleteNcreateCart.mockResolvedValue(resultCart);

    const result = await cartService.addToCart(storeId, menuId, userId);
    expect(result).toEqual(resultCart);
    expect(cartRepository.deleteNcreateCart).toHaveBeenCalledWith(
      storeId,
      menuId,
      userId,
      cartId
    );
  });

  test('addToCart 테스트(추가하려는 메뉴가 이미 카트에 존재할 때)', async () => {
    const storeId = 1;
    const menuId = 1;
    const userId = 1;
    const cartId = 1;

    const sampleMenu = {
      id: 1,
      storeId: 1,
      menuName: 'menu1',
      menuInfo: 'menu1',
      price: 15000,
      menuImage: 'menu1.jpg',
    };

    cartRepository.getMenuById.mockResolvedValue(sampleMenu);
    cartRepository.getCartByUserId.mockResolvedValue(sampleCart);
    cartRepository.updateCart.mockResolvedValue({
      ...sampleCart,
      quantity: sampleCart.quantity + 1,
    });

    const result = await cartService.addToCart(storeId, menuId, userId);

    expect(result).toEqual({
      ...sampleCart,
      quantity: sampleCart.quantity + 1,
    });
    expect(cartRepository.updateCart).toHaveBeenCalledWith(
      cartId,
      sampleCart.quantity + 1
    );
  });

  test('addToCart 테스트(정상)', async () => {
    const storeId = 1;
    const menuId = 3;
    const userId = 1;

    const sampleMenu = {
      id: 3,
      storeId: 1,
      menuName: 'menu3',
      menuInfo: 'menu3',
      price: 30000,
      menuImage: 'menu3.jpg',
    };

    const resultCart = {
      id: 2,
      menuId: 3,
      orderId: null,
      quantity: 1,
      status: 'AVAILABLE',
      storeId: 1,
      userId: 1,
      createdAt: '2024-02-22T06:38:42.129Z',
      updatedAt: '2024-02-22T06:50:42.129Z',
    };
    cartRepository.getMenuById.mockResolvedValue(sampleMenu);
    cartRepository.getCartByUserId.mockResolvedValue(sampleCart);
    cartRepository.createCart.mockResolvedValue(resultCart);

    const result = await cartService.addToCart(storeId, menuId, userId);
    expect(result).toEqual(resultCart);
    expect(cartRepository.createCart).toHaveBeenCalledWith(
      storeId,
      menuId,
      userId
    );
  });

  test('updateQuantity 테스트 by BadRequestError(quanity가 입력되지 않았을때)', async () => {
    const storeId = 1;
    const menuId = 1;
    const userId = 1;
    const quantity = null;

    await expect(
      cartService.updateQuantity(storeId, menuId, userId, quantity)
    ).rejects.toThrow(
      new BadRequestError('변경하시려는 quantity를 입력해주세요.')
    );
  });

  test('updateQuantity 테스트 by NotFoundError', async () => {
    const storeId = 1;
    const menuId = 1;
    const userId = 1;
    const quantity = 2;

    cartRepository.getCartByUserIdNMenuId.mockResolvedValue(null);

    await expect(
      cartService.updateQuantity(storeId, menuId, userId, quantity)
    ).rejects.toThrow(new NotFoundError('카트에 존재하지 않는 메뉴입니다'));
  });

  test('updateQuantity 테스트 by BadRequestError(카트의 storeId != 추가하려는 메뉴의 storeId일때)', async () => {
    const storeId = 8;
    const menuId = 1;
    const userId = 1;
    const quantity = 2;
    const cartId = 1;

    cartRepository.getCartByUserIdNMenuId.mockResolvedValue(sampleCart);

    await expect(
      cartService.updateQuantity(storeId, menuId, userId, quantity)
    ).rejects.toThrow(new BadRequestError('잘못된 파라미터'));
  });

  test('updateQuantity 테스트 (정상)', async () => {
    const storeId = 1;
    const menuId = 1;
    const userId = 1;
    const quantity = 2;
    const cartId = 1;

    cartRepository.getCartByUserIdNMenuId.mockResolvedValue(sampleCart);
    cartRepository.updateCart.mockResolvedValue({ ...sampleCart, quantity });

    await cartService.updateQuantity(storeId, menuId, userId, quantity);

    expect(cartRepository.updateCart).toHaveBeenCalledWith(cartId, quantity);
  });

  test('getCart 테스트 (카트가 비었을 때)', async () => {
    const userId = 1;

    cartRepository.getCartsByUserId.mockResolvedValue([]);

    const result = await cartService.getCart(userId);
    expect(result).toEqual([]);
  });

  test('getCart 테스트 (정상)', async () => {
    const userId = 1;
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
    const sampleStoreName = {
      storeName: 'Lee Chicken',
    };
    const sampleMenu = [
      { menuName: 'menu1', menuImage: 'menu1.jpg', price: 10000 },
      { menuName: 'menu2', menuImage: 'menu2.jpg', price: 15000 },
    ];
    cartRepository.getCartsByUserId.mockResolvedValue(sampleCarts);
    cartRepository.getStoreNameById.mockResolvedValue(sampleStoreName);
    cartRepository.getMenuById
      .mockResolvedValueOnce(sampleMenu[0])
      .mockResolvedValueOnce(sampleMenu[1]);

    const result = await cartService.getCart(userId);

    expect(result.storeName).toEqual(sampleStoreName.storeName);
    expect(result.totalPrice).toEqual(25000);
    expect(result[0].menuName).toEqual(sampleMenu[0].menuName);
    expect(result[1].menuName).toEqual(sampleMenu[1].menuName);
  });

  test('deleteMenu 테스트 by NotFoundError', async () => {
    const menuId = 88;
    const userId = 1;

    cartRepository.getCartByUserIdNMenuId.mockResolvedValue(null);

    await expect(cartService.deleteMenu(menuId, userId)).rejects.toThrow(
      new NotFoundError('카트에 존재하지 않는 메뉴입니다')
    );
  });

  test('deleteMenu 테스트 (정상)', async () => {
    const menuId = 1;
    const userId = 1;
    const cartId = 1;

    cartRepository.getCartByUserIdNMenuId.mockResolvedValue({ id: cartId });

    await cartService.deleteMenu(menuId, userId);

    expect(cartRepository.deleteCartById).toHaveBeenCalledWith(cartId);
  });
});
