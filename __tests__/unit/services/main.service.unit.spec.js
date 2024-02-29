import { beforeEach, jest } from '@jest/globals';
import { MainService } from '../../../src/services/main.service';
import {
  BadRequestError,
  NotFoundError,
} from '../../../src/middlewares/error-handling.middleware';

let mainRepository = {
  getStoreIdsByMenu: jest.fn(),
  getStoreInfoById: jest.fn(),
  getAllStores: jest.fn(),
  getSortedStores: jest.fn(),
};

let mainService = new MainService(mainRepository);

describe('Main Service Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('searchMenu 테스트 by BadRequestError(검색문자열로 공백문자열 입력했을때)', async () => {
    const searchWord = ' ';

    await expect(mainService.searchMenu(searchWord)).rejects.toThrow(
      new BadRequestError('공백 문자열로 검색할 수 없습니다.')
    );
  });

  test('searchMenu 테스트 by NotFoundError(검색 결과가 없을 때)', async () => {
    const searchWord = '붉둙굵뀨';

    mainRepository.getStoreIdsByMenu.mockResolvedValue([]);

    await expect(mainService.searchMenu(searchWord)).rejects.toThrow(
      new NotFoundError('검색 결과가 없습니다.')
    );
  });

  test('searchMenu 테스트 (정상)', async () => {
    const searchWord = 'pizza';
    const sampleStoreIdList = [{ storeId: 2 }, { storeId: 3 }];
    const sampleStoreInfos = [
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
    ];

    mainRepository.getStoreIdsByMenu.mockResolvedValue(sampleStoreIdList);
    mainRepository.getStoreInfoById
      .mockResolvedValueOnce(sampleStoreInfos[0])
      .mockResolvedValueOnce(sampleStoreInfos[1]);

    const result = await mainService.searchMenu(searchWord);

    expect(result[0].storeId).toEqual(sampleStoreIdList[0].storeId);
    expect(result[1].storeId).toEqual(sampleStoreIdList[1].storeId);
    expect(result[0].storeInfo).toEqual(sampleStoreInfos[0]);
    expect(result[1].storeInfo).toEqual(sampleStoreInfos[1]);
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
    console.log('어리너링너ㅣ린어');
    mainRepository.getAllStores.mockResolvedValue(sampleStores);

    const result = await mainService.getAllStores();

    expect(result).toEqual(sampleStores);
  });

  test('sortStores 테스트 by BadRequestError(orderKey나 orderValue가 입력되지 않았을 때)', async () => {
    const orderKey = null,
      orderValue = undefined;

    await expect(mainService.sortStores(orderKey, orderValue)).rejects.toThrow(
      new BadRequestError('orderKey와 orderValue를 입력해주세요.')
    );
  });

  test('sortStores 테스트 by BadRequestError(입력된 orderKey가 잘못된 형식일 때)', async () => {
    const orderKey = 'YO',
      orderValue = 'desc';
    await expect(mainService.sortStores(orderKey, orderValue)).rejects.toThrow(
      new BadRequestError(
        'orderKey는 orderCount, storeRate, storeName, shippingFee, createdAt 중 하나여야 합니다.'
      )
    );
  });

  test('sortStores 테스트 by BadRequestError(입력된 orderValue가 잘못된 형식일 때)', async () => {
    const orderKey = 'createdAt',
      orderValue = 'YO';
    await expect(mainService.sortStores(orderKey, orderValue)).rejects.toThrow(
      new BadRequestError('orderValue는 asc나 desc 여야 합니다.')
    );
  });

  test('sortStores 테스트 (정상)', async () => {
    const orderKey = 'storeRate',
      orderValue = 'desc';
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

    mainRepository.getSortedStores.mockResolvedValue(sampleSortedStores);

    const result = await mainService.sortStores(orderKey, orderValue);

    expect(result).toEqual(sampleSortedStores);
    expect(mainRepository.getSortedStores).toHaveBeenCalledTimes(1);
    expect(mainRepository.getSortedStores).toHaveBeenCalledWith(
      orderKey,
      orderValue
    );
  });
});
