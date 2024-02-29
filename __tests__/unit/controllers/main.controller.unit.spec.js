import { beforeEach, describe, jest } from '@jest/globals';
import { MainController } from '../../../src/controllers/main.controller';

const mainService = {
  searchMenu: jest.fn(),
  getAllStores: jest.fn(),
  sortStores: jest.fn(),
  getStoreRanking: jest.fn(),
};

const req = {
  body: jest.fn(),
  params: jest.fn(),
  query: jest.fn(),
};

const res = {
  status: jest.fn(),
  json: jest.fn(),
};

const next = jest.fn();

const mainController = new MainController(mainService);

describe('Main Controller Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    res.status.mockReturnValue(res); // because of method chaining~~
  });

  test('searchMenu 테스트 (정상)', async () => {
    req.query = { searchWord: 'pizza' };
    const sampleSearchedStores = [
      {
        storeId: 2,
        storeInfo: {
          storeName: 'ppack boy Pizza',
          storeRate: 5.0,
          storeIntro: 'delicious~',
          storeImage: 'parkBoy.jpg',
          id: 2,
        },
      },
      {
        storeId: 3,
        storeInfo: {
          storeName: 'Sparkle Pizza',
          storeRate: 4.5,
          storeIntro: 'very yumyum',
          storeImage: 'sparkle.jpg',
          id: 3,
        },
      },
    ];
    mainService.searchMenu.mockResolvedValue(sampleSearchedStores);

    await mainController.searchMenu(req, res, next);

    expect(mainService.searchMenu).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({
      searchedStores: sampleSearchedStores,
    });
  });

  test('getAllStores 테스트 (정상)', async () => {
    const sampleStores = [
      {
        storeName: 'ppack boy Pizza',
        storeRate: 5.0,
        storeIntro: 'delicious~',
        storeImage: 'parkBoy.jpg',
        id: 2,
      },
      {
        storeName: 'Sparkle Pizza',
        storeRate: 4.5,
        storeIntro: 'very yumyum',
        storeImage: 'sparkle.jpg',
        id: 3,
      },
      {
        storeName: 'bhc chicken',
        storeRate: 4.3,
        storeIntro: 'boom boom pow',
        storeImage: 'ppurinkle.jpg',
        id: 4,
      },
    ];
    mainService.getAllStores.mockResolvedValue(sampleStores);

    await mainController.getAllStores(req, res, next);

    expect(mainService.getAllStores).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ stores: sampleStores });
  });

  test('sortStores 테스트 (정상)', async () => {
    req.query = { orderKey: 'storeRate', orderValue: 'desc' };
    const sampleSortedStores = [
      {
        storeName: 'ppack boy Pizza',
        storeRate: 5.0,
        storeIntro: 'delicious~',
        storeImage: 'parkBoy.jpg',
        id: 2,
      },
      {
        storeName: 'Sparkle Pizza',
        storeRate: 4.5,
        storeIntro: 'very yumyum',
        storeImage: 'sparkle.jpg',
        id: 3,
      },
      {
        storeName: 'bhc chicken',
        storeRate: 4.3,
        storeIntro: 'boom boom pow',
        storeImage: 'ppurinkle.jpg',
        id: 4,
      },
    ];

    mainService.sortStores.mockResolvedValue(sampleSortedStores);

    await mainController.sortStores(req, res, next);

    expect(mainService.sortStores).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ sortedStores: sampleSortedStores });
  });

  test('getStoreRanking 테스트 (정상)', async () => {
    const sampleRanking = [
      {
        id: 1,
        ownerId: 2,
        storeName: 'bhc chicken',
        category: 'CHICKEN',
        storeImage: 'ppuringkle.jpg',
        storeRate: 4.5,
        orderCount: 3,
        status: 'AVAILABLE',
        sales: 79500,
      },
      {
        id: 2,
        ownerId: 4,
        storeName: 'Sparkle Pizza',
        category: 'PIZZA',
        storeImage: 'sparkle.jpg',
        storeRate: 4.4,
        orderCount: 2,
        status: 'AVAILABLE',
        sales: 50000,
      },
    ];

    mainService.getStoreRanking.mockResolvedValue(sampleRanking);

    await mainController.getStoreRanking(req, res, next);

    expect(mainService.getStoreRanking).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledTimes(1);
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledTimes(1);
    expect(res.json).toHaveBeenCalledWith({ ranking: sampleRanking });
  });
});
