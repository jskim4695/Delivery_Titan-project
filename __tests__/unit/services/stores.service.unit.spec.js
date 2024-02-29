import { expect, jest } from '@jest/globals';
import { StoresService } from '../../../src/services/stores.service';
import {
  ApiError,
} from '../../../src/middlewares/error-handling.middleware';

let mockStoresRepository = {
    findAllStores: jest.fn(),
    createStore: jest.fn(),
    findStoreById: jest.fn(),
    findStoreByOwner: jest.fn(),
    updateStore: jest.fn(),
    deleteStore: jest.fn(),
};

let storesService = new StoresService(mockStoresRepository);

describe('Stores Service Unit Test', () => {
    beforeEach(() => {
      jest.resetAllMocks();
    });

    const sampleStore = {
        ownerId: 2,
        storeName : "롯데리아",
        category : "WESTERN",
        storeImage : "test",
        storeIntro : "롯데리아입니다",
        status: "AVAILABLE",
        storeAddress: "테스트 주소",
        storePhone: "01022220000",
        shippingFee: 2000,
        createdAt: "2024-02-27T00:49:02.810Z",
        updatedAt: "2024-02-27T00:49:02.810Z"
    };

    const sampleStores = [
        {
            ownerId: 1,
            storeName : "맥도날드",
            category : "WESTERN",
            storeImage : "test",
            storeIntro : "맥도날드입니다.",
            status: "AVAILABLE",
            storeAddress: "테스트 주소",
            storePhone: "01022220000",
            shippingFee: 4000,
            createdAt: "2024-02-27T00:49:02.810Z",
            updatedAt: "2024-02-27T00:49:02.810Z"
        },
        {
            ownerId: 2,
            storeName : "롯데리아",
            category : "WESTERN",
            storeImage : "test",
            storeIntro : "롯데리아입니다",
            status: "AVAILABLE",
            storeAddress: "테스트 주소",
            storePhone: "01022220000",
            shippingFee: 2000,
            createdAt: "2024-02-27T00:49:02.810Z",
            updatedAt: "2024-02-27T00:49:02.810Z"
        },
    ];


    test('createStore 테스트 (정상)', async () => {


		mockStoresRepository.createStore.mockReturnValue({
			...sampleStore,
		});

		const result = await storesService.createStore(
      sampleStore.ownerId,
      sampleStore.ownerNickname,
      sampleStore.storeName,
      sampleStore.category,
      sampleStore.storeImage,
      sampleStore.storeIntro,
      sampleStore.status,
      sampleStore.storeAddress,
      sampleStore.storePhone,
      sampleStore.shippingFee,
      sampleStore.createdAt,
      sampleStore.updatedAt
		);

		expect(mockStoresRepository.createStore).toHaveBeenCalledTimes(1);
		expect(mockStoresRepository.createStore).toHaveBeenCalledWith(
      
      sampleStore.ownerId,
      sampleStore.ownerNickname,
      sampleStore.storeName,
      sampleStore.category,
      sampleStore.storeImage,
      sampleStore.storeIntro,
      sampleStore.status,
      sampleStore.storeAddress,
      sampleStore.storePhone
		);
		expect(result).toEqual(sampleStore);


    });


  test('createStore 테스트 by 이미 업장 존재하는 계정', async () => {
    const ownerId = '1';

    mockStoresRepository.findStoreByOwner.mockResolvedValue({ id: +ownerId });

    await expect(storesService.createStore(ownerId)).rejects.toThrow(
      new ApiError(403, '이미 본인 계정에 업장이 존재합니다.')
    );
  });

  test('findStoreById 테스트 (정상)', async () => {
    const storeId = 1;
    const sampleStore = {
      ownerId: 1,
      storeName: '맥도날드',
      category: 'WESTERN',
      contents: null, 
      storeImage: 'test',
      storeIntro: '맥도날드입니다.',
      status: 'AVAILABLE',
      storeAddress: '테스트 주소',
      storePhone: '01022220000',
      shippingFee: 4000,
      user : {
        nickname : 'test'
      },
      createdAt: '2024-02-27T00:49:02.810Z',
      updatedAt: '2024-02-27T00:49:02.810Z'
    };
    const expectedStore = {
      ownerId: 1,
      ownerNickname: 'test',
      storeName: '맥도날드',
      category: 'WESTERN',
      contents: null, 
      storeImage: 'test',
      storeIntro: '맥도날드입니다.',
      status: 'AVAILABLE',
      storeAddress: '테스트 주소',
      storePhone: '01022220000',
      shippingFee: 4000,
      createdAt: '2024-02-27T00:49:02.810Z',
      updatedAt: '2024-02-27T00:49:02.810Z'
    };
  
    mockStoresRepository.findStoreById.mockResolvedValue(sampleStore);
  
    const result = await storesService.findStoreById(storeId);
  
    expect(mockStoresRepository.findStoreById).toBeCalledTimes(1); 
    expect(mockStoresRepository.findStoreById).toBeCalledWith(storeId); 
    expect(result).toEqual(expectedStore); 
  });
  
  test('findStoreById 테스트 (업장이 존재하지 않을 때)', async () => {
    const storeId = 999; 
    mockStoresRepository.findStoreById.mockResolvedValue(null);
  
    await expect(storesService.findStoreById(storeId)).rejects.toThrow(
      new ApiError(404, '해당 업장이 없습니다.')
    );
  
    expect(mockStoresRepository.findStoreById).toBeCalledTimes(1);
    expect(mockStoresRepository.findStoreById).toBeCalledWith(storeId);
  });


  test('updateStore 테스트 (정상)', async () => {
    const loginId = 1;
    const storeId = 1;
    const updatedStoreInfo = {
      storeName: '새로운 가게',
      category: 'KOREAN',
      storeImage: '새로운 이미지 경로',
      storeIntro: '새로운 소개',
      status: 'UPDATED',
      storeAddress: '새로운 주소',
      storePhone: '01012345678',
      shippingFee: 3000,
    };
  
    const fakeStore = {
      ownerId: loginId,
      storeImage: '기존 이미지 경로',
      ...updatedStoreInfo, 
    };
  
    mockStoresRepository.findStoreById.mockResolvedValue(fakeStore);
  
    const resultPromise = storesService.updateStore(
      loginId + 1, 
      storeId,
      updatedStoreInfo.storeName,
      updatedStoreInfo.category,
      updatedStoreInfo.storeImage,
      updatedStoreInfo.storeIntro,
      updatedStoreInfo.status,
      updatedStoreInfo.storeAddress,
      updatedStoreInfo.storePhone,
      updatedStoreInfo.shippingFee
    );
  
    await expect(resultPromise).rejects.toThrow(
      new ApiError(403, `본인의 업장 정보만 수정 가능합니다.`)
    );
  
    await storesService.updateStore(
      loginId, 
      storeId,
      updatedStoreInfo.storeName,
      updatedStoreInfo.category,
      updatedStoreInfo.storeImage,
      updatedStoreInfo.storeIntro,
      updatedStoreInfo.status,
      updatedStoreInfo.storeAddress,
      updatedStoreInfo.storePhone,
      updatedStoreInfo.shippingFee
    );
  
    expect(mockStoresRepository.updateStore).toHaveBeenCalledTimes(1);
    expect(mockStoresRepository.updateStore).toHaveBeenCalledWith(
      storeId,
      updatedStoreInfo.storeName,
      updatedStoreInfo.category,
      updatedStoreInfo.storeImage,
      updatedStoreInfo.storeIntro,
      updatedStoreInfo.status,
      updatedStoreInfo.storeAddress,
      updatedStoreInfo.storePhone,
      updatedStoreInfo.shippingFee
    );
  
  });
  
  test('updateStore 테스트 by NotFoundError (해당 업장 존재하지 않을때)', async () => {
    const loginId = 1;
    const nonExistingStoreId = 100;
  
    mockStoresRepository.findStoreById.mockResolvedValue(null);
  
    const updatePromise = storesService.updateStore(
      loginId,
      nonExistingStoreId,
      '새로운 가게 이름',
      'KOREAN',
      '새로운 이미지 경로',
      '새로운 소개',
      'UPDATED',
      '새로운 주소',
      '01012345678',
      3000
    );
  
    await expect(updatePromise).rejects.toThrow(
      new ApiError(404, '해당 업장 정보가 없습니다.')
    );
  
    expect(mockStoresRepository.updateStore).not.toHaveBeenCalled();
  });

});