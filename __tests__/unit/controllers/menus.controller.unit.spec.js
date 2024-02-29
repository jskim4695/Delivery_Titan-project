import { beforeEach, jest } from '@jest/globals';
import { MenuController } from '../../../src/controllers/menus.controller.js';
import { ApiError } from '../../../src/middlewares/error-handling.middleware.js';

const mockMenuService = {
  findAllMenu: jest.fn(),
  findMenuById: jest.fn(),
  createMenu: jest.fn(),
  updateMenu: jest.fn(),
  deleteMenu: jest.fn(),
};

const mockRequest = {
  body: {},
  file: {
    location: 'https://donottouch91.s3.ap-northeast-2.amazonaws.com/storeImage/9801f6cf109df2b1f1f85b32ac14ea1af59304702c1d0a6ee115bb7fe85949c7.png'
  },
  userId: 4,
  params: { storeId: 1 },
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();

const menuController = new MenuController(mockMenuService);

describe('Menu Controller Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockResponse.status.mockReturnValue(mockResponse);
  });

  describe('getMenu 메소드 테스트', () => {
    test('메뉴가 존재할 때', async () => {
      const fakeMenu = [
        { id: 1, name: '아메리카노', price: 3000 },
        { id: 2, name: '카페라떼', price: 3500 }
      ];

      mockMenuService.findAllMenu.mockResolvedValue(fakeMenu);

      await menuController.getMenu(mockRequest, mockResponse, mockNext);

      expect(mockMenuService.findAllMenu).toHaveBeenCalledWith(mockRequest.params.storeId);

      expect(mockResponse.status).toHaveBeenCalledWith(200);
      expect(mockResponse.json).toHaveBeenCalledWith({ data: fakeMenu });
    });

    
  });

});