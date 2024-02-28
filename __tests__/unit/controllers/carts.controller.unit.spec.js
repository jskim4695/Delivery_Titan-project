import { jest } from '@jest/globals';
import { CartController } from '../../../src/controllers/carts.controller';

let cartService = {
  addToCart: jest.fn(),
  updateQuantity: jest.fn(),
  getCart: jest.fn(),
  deleteMenu: jest.fn(),
};

let cartController = new CartController(cartService);

describe('Cart Controller Unit Test', () => {
  let req, res, next;
  beforeEach(() => {
    jest.resetAllMocks();
    req = {
      params: { storeId: 1, menuId: 1 },
      body: { quantity: 1 },
      userId: 1,
    };
    res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
    next = jest.fn();
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

  test('addToCart 테스트 (정상)', async () => {
    cartService.addToCart.mockResolvedValue(sampleCart);

    await cartController.addToCart(req, res, next);

    expect(cartService.addToCart).toHaveBeenCalledWith(
      req.params.storeId,
      req.params.menuId,
      req.userId
    );
    expect(cartService.addToCart).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ cart: sampleCart });
  });

  test('addToCart 테스트 (실패)', async () => {
    const mockError = new Error('카트 담기 실패');

    cartService.addToCart.mockRejectedValue(mockError);

    await cartController.addToCart(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });

  test('updateQuantity 테스트 (정상)', async () => {
    cartService.updateQuantity.mockResolvedValue(sampleCart);

    await cartController.updateQuantity(req, res, next);

    expect(cartService.updateQuantity).toHaveBeenCalledWith(
      req.params.storeId,
      req.params.menuId,
      req.userId,
      req.body.quantity
    );
    expect(cartService.updateQuantity).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ cart: sampleCart });
  });

  test('updateQuantity 테스트 (실패)', async () => {
    const mockError = new Error('카트에 담긴 메뉴 수량 변경 실패');

    cartService.updateQuantity.mockRejectedValue(mockError);

    await cartController.updateQuantity(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });

  test('getCart 테스트 (성공)', async () => {
    cartService.getCart.mockResolvedValue(sampleCart);

    await cartController.getCart(req, res, next);

    expect(cartService.getCart).toHaveBeenCalledWith(req.userId);
    expect(cartService.getCart).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ cart: sampleCart });
  });

  test('getCart 테스트 (실패)', async () => {
    const mockError = new Error('카트 조회 실패패');

    cartService.getCart.mockRejectedValue(mockError);

    await cartController.getCart(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });

  test('deleteMenu 테스트 (성공)', async () => {
    cartService.deleteMenu.mockResolvedValue();
    cartService.getCart.mockResolvedValue(sampleCart);

    await cartController.deleteMenu(req, res, next);

    expect(cartService.deleteMenu).toHaveBeenCalledWith(
      req.params.menuId,
      req.userId
    );
    expect(cartService.deleteMenu).toHaveBeenCalledTimes(1);
    expect(cartService.getCart).toHaveBeenCalledWith(req.userId);
    expect(cartService.getCart).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({ cart: sampleCart });
  });

  test('deleteMenu 테스트 (실패)', async () => {
    const mockError = new Error('카트에서 메뉴 삭제 실패');

    cartService.deleteMenu.mockRejectedValue(mockError);

    await cartController.deleteMenu(req, res, next);

    expect(next).toHaveBeenCalledWith(mockError);
  });
});
