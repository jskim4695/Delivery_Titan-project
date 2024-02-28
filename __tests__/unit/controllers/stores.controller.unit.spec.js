import { beforeEach, jest } from '@jest/globals';
import { StoresController } from '../../../src/controllers/stores.controller';
import { ApiError } from '../../../src/middlewares/error-handling.middleware';

const mockStoresService = {
  findAllStores: jest.fn(),
  findStoreById: jest.fn(),
  createStore: jest.fn(),
  updateStore: jest.fn(),
  deleteStore: jest.fn(),
};

const mockRequest = {
  body: jest.fn(),
};

const mockResponse = {
  status: jest.fn(),
  json: jest.fn(),
};

const mockNext = jest.fn();
const storesController = new StoresController(mockStoresService);

describe('Stores Controller Unit Test', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    mockResponse.status.mockReturnValue(mockResponse);
  });

  test('getStores Method by Success', async () => {
    const sampleStores = [
      {
        ownerId: 2,
        ownerNickname: '테스트유저2',
        storeName: '롯데리아',
        category: 'WESTERN',
        storeImage: 'test',
        storeIntro: '롯데리아입니다',
        status: 'AVAILABLE',
        storeAddress: '테스트 주소',
        storePhone: '01022220000',
        shippingFee: 2000,
        createdAt: '2024-02-27T00:49:02.810Z',
        updatedAt: '2024-02-27T00:49:02.810Z',
      },
      {
        ownerId: 1,
        ownerNickname: '테스트유저',
        storeName: '맥도날드',
        category: 'WESTERN',
        storeImage: 'test',
        storeIntro: '참깨빵 위에 순쇠고기',
        status: 'AVAILABLE',
        storeAddress: '테스트 주소22',
        storePhone: '01022220000',
        shippingFee: 4000,
        createdAt: '2024-02-26T13:15:27.936Z',
        updatedAt: '2024-02-26T13:21:28.339Z',
      },
    ];

    mockStoresService.findAllStores.mockResolvedValue(sampleStores);
    await storesController.getStores(mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: sampleStores });
  });

  test('createStore Method by Success', async () => {
    const createStoreRequestBodyParams = {
      ownerId: 2,
      storeName: '롯데리아',
      category: 'WESTERN',
      storeImage: 'test',
      storeIntro: '롯데리아입니다',
      status: 'AVAILABLE',
      storeAddress: '테스트 주소',
      storePhone: '01022220000',
      shippingFee: 2000,
    };

    mockRequest.body = createStoreRequestBodyParams;
    mockStoresService.createStore.mockReturnValue(
      Promise.resolve('이력서 생성 완료')
    );

    await storesController.createStore(mockRequest, mockResponse, mockNext);

    expect(mockStoresService.createStore).toHaveBeenCalledWith(
      createStoreRequestBodyParams.ownerId,
      createStoreRequestBodyParams.storeName,
      createStoreRequestBodyParams.category,
      createStoreRequestBodyParams.storeImage,
      createStoreRequestBodyParams.storeIntro,
      createStoreRequestBodyParams.status,
      createStoreRequestBodyParams.storeAddress,
      createStoreRequestBodyParams.storePhone,
      createStoreRequestBodyParams.shippingFee
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: '이력서 생성 완료',
    });
  });
});
