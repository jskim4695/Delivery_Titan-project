import { beforeEach, jest } from '@jest/globals';
import { StoresController } from '../../../src/controllers/stores.controller.js';
import { ApiError } from '../../../src/middlewares/error-handling.middleware.js';

const mockStoresService = {
  findAllStores: jest.fn(),
  findStoreById: jest.fn(),
  createStore: jest.fn(),
  findStoreByOwner: jest.fn(),
  updateStore: jest.fn(),
  deleteStore: jest.fn(),
};

const mockRequest = {
  body: {},
  file: {
    location: 'https://donottouch91.s3.ap-northeast-2.amazonaws.com/storeImage/9801f6cf109df2b1f1f85b32ac14ea1af59304702c1d0a6ee115bb7fe85949c7.png'
  },
  userId: 4,
  params: {},
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
        ownerId: 4,
        ownerNickname: "테스트닉네임",
        storeName: "본죽",
        category: "KOREAN",
        storeImage: "https://donottouch91.s3.ap-northeast-2.amazonaws.com/storeImage/9801f6cf109df2b1f1f85b32ac14ea1af59304702c1d0a6ee115bb7fe85949c7.png",
        storeIntro: "본죽",
        status: "AVAILABLE",
        storeAddress: "테스트 주소22",
        storePhone: "01022220000",
        shippingFee: 4000,
        createdAt: "2024-02-28T12:09:12.368Z",
        updatedAt: "2024-02-28T12:09:12.368Z"
      }
    ];

    mockStoresService.findAllStores.mockResolvedValue(sampleStores);
    await storesController.getStores(mockRequest, mockResponse, mockNext);
    expect(mockResponse.status).toHaveBeenCalledWith(200);
    expect(mockResponse.json).toHaveBeenCalledWith({ data: sampleStores });
  });

  test('createStore Method by Success', async () => {
    const createStoreRequestBodyParams = {
      storeName: "본죽",
      category: "KOREAN",
      storeIntro: "본죽",
      status: "AVAILABLE",
      storeAddress: "테스트 주소22",
      storePhone: "01022220000",
      shippingFee: 4000,
    };

    mockRequest.body = createStoreRequestBodyParams;

    const createdStore = {
      ownerId: 4,
      storeName: "본죽",
      category: "KOREAN",
      storeImage: mockRequest.file.location,
      storeIntro: "본죽",
      status: "AVAILABLE",
      storeAddress: "테스트 주소22",
      storePhone: "01022220000",
      shippingFee: 4000,
      createdAt: "2024-02-28T12:09:12.368Z",
      updatedAt: "2024-02-28T12:09:12.368Z"
    };

    mockStoresService.createStore.mockResolvedValue(createdStore);

    await storesController.createStore(mockRequest, mockResponse, mockNext);

    expect(mockStoresService.createStore).toHaveBeenCalledWith(
      mockRequest.userId,
      createStoreRequestBodyParams.storeName,
      createStoreRequestBodyParams.category,
      mockRequest.file.location,
      createStoreRequestBodyParams.storeIntro,
      createStoreRequestBodyParams.status,
      createStoreRequestBodyParams.storeAddress,
      createStoreRequestBodyParams.storePhone,
      createStoreRequestBodyParams.shippingFee,
    );
    expect(mockResponse.status).toHaveBeenCalledWith(201);
    expect(mockResponse.json).toHaveBeenCalledWith({
      data: createdStore,
    });
  });

  
  
  test('updateStore Method by Success', async () => {
	const storeId = 1;
	const updateRequestBodyParams = {
	  storeName: "본죽",
	  category: "KOREAN",
	  storeIntro: "본죽",
	  status: "AVAILABLE",
	  storeAddress: "테스트 주소22",
	  storePhone: "01022220000",
	  shippingFee: 4000,
	};
  
	mockRequest.body = updateRequestBodyParams;
	mockRequest.params.storeId = storeId;
  
	const updatedStore = {
	  ownerId: 4,
	  storeName: "본죽",
	  category: "KOREAN",
	  storeImage: mockRequest.file.location,
	  storeIntro: "본죽",
	  status: "AVAILABLE",
	  storeAddress: "테스트 주소22",
	  storePhone: "01022220000",
	  shippingFee: 4000,
	  createdAt: "2024-02-28T12:09:12.368Z",
	  updatedAt: "2024-02-28T12:09:12.368Z"
	};
  
	mockStoresService.updateStore.mockResolvedValue(updatedStore);
  
	await storesController.updateStore(mockRequest, mockResponse, mockNext);
  
	expect(mockStoresService.updateStore).toHaveBeenCalledWith(
	  mockRequest.userId,
	  storeId,
	  updateRequestBodyParams.storeName,
	  updateRequestBodyParams.category,
	  mockRequest.file.location,
	  updateRequestBodyParams.storeIntro,
	  updateRequestBodyParams.status,
	  updateRequestBodyParams.storeAddress,
	  updateRequestBodyParams.storePhone,
	  updateRequestBodyParams.shippingFee,
	);
	expect(mockResponse.status).toHaveBeenCalledWith(200);
	expect(mockResponse.json).toHaveBeenCalledWith({ data: updatedStore });
  });
  
  test('deleteStore Method by Success', async () => {
	const storeId = 1;
	mockRequest.params.storeId = storeId;
  
	const deletedStore = {
	  ownerId: 4,
	  storeName: "본죽",
	  category: "KOREAN",
	  storeImage: "https://donottouch91.s3.ap-northeast-2.amazonaws.com/storeImage/9801f6cf109df2b1f1f85b32ac14ea1af59304702c1d0a6ee115bb7fe85949c7.png",
	  storeIntro: "본죽",
	  status: "AVAILABLE",
	  storeAddress: "테스트 주소22",
	  storePhone: "01022220000",
	  shippingFee: 4000,
	  createdAt: "2024-02-28T12:09:12.368Z",
	  updatedAt: "2024-02-28T12:09:12.368Z"
	};
  
	mockStoresService.deleteStore.mockResolvedValue(deletedStore);
  
	await storesController.deleteStore(mockRequest, mockResponse, mockNext);
  
	expect(mockStoresService.deleteStore).toHaveBeenCalledWith(storeId, mockRequest.userId);
	expect(mockResponse.status).toHaveBeenCalledWith(200);
	expect(mockResponse.json).toHaveBeenCalledWith({ data: deletedStore });
  });
});
