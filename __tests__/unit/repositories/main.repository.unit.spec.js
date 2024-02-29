import { beforeEach, jest } from '@jest/globals';
import { MainRepository } from '../../../src/repositories/main.repository.js';

let prisma = {
  menu: {
    findMany: jest.fn(),
  },
  stores: {
    findFirst: jest.fn(),
    findMany: jest.fn(),
  },
};

let mainRepository = new MainRepository(prisma);

describe('Main Repository Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('getStoreIdsByMenu 테스트 (정상)', async () => {
    const searchWord = 'pizza';
    const sampleStoreIdList = [{ storeId: 1 }, { storeId: 2 }];

    prisma.menu.findMany.mockResolvedValue(sampleStoreIdList);
    const result = await mainRepository.getStoreIdsByMenu(searchWord);

    expect(prisma.menu.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.menu.findMany).toHaveBeenCalledWith({
      where: { menuName: { contains: searchWord } },
      select: { storeId: true },
    });
    expect(result).toEqual(sampleStoreIdList);
  });

  test('getStoreInfoById 테스트 (정상)', async () => {
    const id = 3;
    const sampleStoreInfo = {
      storeName: 'Sparkle Pizza',
      storeRate: 4.5,
      storeIntro: 'very yumyum',
      storeImage: 'sparkle.jpg',
    };

    prisma.stores.findFirst.mockResolvedValue(sampleStoreInfo);

    const result = await mainRepository.getStoreInfoById(id);

    expect(result).toEqual(sampleStoreInfo);
    expect(prisma.stores.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.stores.findFirst).toHaveBeenCalledWith({
      where: { id: +id },
      select: {
        storeName: true,
        storeRate: true,
        storeIntro: true,
        storeImage: true,
      },
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

    prisma.stores.findMany.mockResolvedValue(sampleStores);

    const result = await mainRepository.getAllStores();
    expect(result).toEqual(sampleStores);
    expect(prisma.stores.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.stores.findMany).toHaveBeenCalledWith({
      select: {
        storeName: true,
        storeRate: true,
        storeIntro: true,
        storeImage: true,
        id: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  });

  test('getSortedStores 테스트 (정상)', async () => {
    const orderKey = 'storeRate',
      orderValue = 'desc';
    const sampleSortedStores = [
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
        storeIntro: 'boom boom good',
        storeImage: 'ppurinkle.jpg',
        id: 4,
      },
    ];

    prisma.stores.findMany.mockResolvedValue(sampleSortedStores);

    const result = await mainRepository.getSortedStores(orderKey, orderValue);

    expect(result).toEqual(sampleSortedStores);
    expect(prisma.stores.findMany).toHaveBeenCalledTimes(1);
    expect(prisma.stores.findMany).toHaveBeenCalledWith({
      select: {
        storeName: true,
        storeRate: true,
        storeIntro: true,
        storeImage: true,
        id: true,
      },
      orderBy: {
        [orderKey]: orderValue,
      },
    });
  });

  test('getStoresNOrders 테스트 (정상)', async () => {
    const sampleStores = [
      {
        id: 1,
        ownerId: 2,
        storeName: 'bhc chicken',
        category: 'CHICKEN',
        storeImage: 'ppuringkle.jpg',
        storeIntro: 'tasty~~',
        storeRate: 4.5,
        orderCount: 3,
        status: 'AVAILABLE',
        storeAddress: 'Seoul',
        storePhone: '01000000000',
        createdAt: '2024-02-27T03:08:04.175Z',
        updatedAt: '2024-02-29T02:11:45.494Z',
        shippingFee: 3000,
        orders: [
          { id: 1, totalPrice: 32000 },
          { id: 2, totalPrice: 24500 },
          { id: 3, totalPrice: 23000 },
        ],
      },
    ];
  });
});
