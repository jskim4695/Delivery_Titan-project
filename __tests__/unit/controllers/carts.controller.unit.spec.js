import { expect, jest } from '@jest/globals';
import { CartController } from '../../../src/controllers/carts.controller';

let cartService = {
  addToCart: jest.fn(),
  updateQuantity: jest.fn(),
  getCart: jest.fn(),
  deleteMenu: jest.fn(),
};

const req = {
  body: jest.fn(),
  params: jest.fn(),
};

const res = {
  status: jest.fn(),
  json: jest.fn(),
};

const next = jest.fn();

let cartController = new CartController(cartService);

describe('Cart Controller Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    res.status.mockReturnValue(res);
  });

  test('addToCart 테스트 (정상)', async () => {
    req.params = { storeId: 1, menuId: 1 };
    req.userId = 1;
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

    cartService.addToCart.mockResolvedValue(sampleCart);

    await cartController.addToCart(req, res, next);

    expect(cartService.addToCart).toHaveBeenCalledTimes(1);
    expect(cartService.addToCart).toHaveBeenCalledWith(
      req.params.storeId,
      req.params.menuId,
      req.userId
    );
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ cart: sampleCart });
  });

  test('updateQuantity 테스트 (정상)', async () => {
    req.params = { storeId: 1, menuId: 1 };
    req.userId = 1;
    req.body = { quantity: 3 };
    const sampleCart = {
      id: 1,
      menuId: 1,
      orderId: null,
      quantity: 3,
      status: 'AVAILABLE',
      storeId: 1,
      userId: 1,
      createdAt: '2024-02-20T06:38:42.129Z',
      updatedAt: '2024-02-20T06:50:42.129Z',
    };

    cartService.updateQuantity.mockResolvedValue(sampleCart);

    await cartController.updateQuantity(req, res, next);

    expect(cartService.updateQuantity).toHaveBeenCalledTimes(1);
    expect(cartService.updateQuantity).toHaveBeenCalledWith(
      req.params.storeId,
      req.params.menuId,
      req.userId,
      req.body.quantity
    );
    expect(res.status).toBeCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ cart: sampleCart });
  });

  test('getCart 테스트 (성공)', async () => {
    req.params = { storeId: 1, menuId: 1 };
    req.userId = 1;
    req.body = { quantity: 2 };
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

    cartService.getCart.mockResolvedValue(sampleCart);

    await cartController.getCart(req, res, next);

    expect(cartService.getCart).toHaveBeenCalledTimes(1);
    expect(cartService.getCart).toHaveBeenCalledWith(req.userId);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ cart: sampleCart });
  });

  test('deleteMenu 테스트 (성공)', async () => {
    req.params = { menuId: 1 };
    req.userId = 1;

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

    cartService.deleteMenu.mockResolvedValue();
    cartService.getCart.mockResolvedValue(sampleCart);

    await cartController.deleteMenu(req, res, next);

    expect(cartService.deleteMenu).toHaveBeenCalledTimes(1);
    expect(cartService.deleteMenu).toHaveBeenCalledWith(
      req.params.menuId,
      req.userId
    );
    expect(cartService.getCart).toHaveBeenCalledWith(req.userId);
    expect(cartService.getCart).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ cart: sampleCart });
  });
});
