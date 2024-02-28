import { jest } from '@jest/globals';
import { StoresRepository } from '../../../src/repositories/stores.repository.js';

let mockPrisma = {
  stores: {
    findMany: jest.fn(),
    findUnique: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
};

let storesRepository = new StoresRepository(mockPrisma);
describe('Stores Repository Unit Test', () => {
  // 테스트 실행시키기 전에 실행...
  beforeEach(() => {
    jest.resetAllMocks(); // Mock 초기화
  });

  // 테스트 시작!
  test('findAllStores Method', async () => {
    const mockReturn = 'findMany String';
    mockPrisma.stores.findMany.mockReturnValue(mockReturn);

    const stores = await storesRepository.findAllStores();

    //한번만 호출
    expect(storesRepository.prisma.stores.findMany).toHaveBeenCalledTimes(1);
    expect(stores).toBe(mockReturn);
  });

  test('createStore Method', async () => {
    const mockReturn = 'create Return String';
    mockPrisma.stores.create.mockReturnValue(mockReturn);

    const createStoreParams = {
      ownerId: 1,
      storeName: '맥도날드',
      category: 'WESTERN',
      storeImage: 'test',
      storeIntro: '참깨빵 위에 순쇠고기',
      status: 'AVAILABLE',
      storeAddress: '테스트 주소22',
      storePhone: '01022220000',
      shippingFee: 4000,
    };

    const createStoreData = await storesRepository.createStore(
      createStoreParams.ownerId,
      createStoreParams.storeName,
      createStoreParams.category,
      createStoreParams.storeImage,
      createStoreParams.storeIntro,
      createStoreParams.status,
      createStoreParams.storeAddress,
      createStoreParams.storePhone,
      createStoreParams.shippingFee
    );

    expect(createStoreData).toBe(mockReturn);
    expect(mockPrisma.stores.create).toHaveBeenCalledTimes(1);
    expect(mockPrisma.stores.create).toHaveBeenCalledWith({
      data: createStoreParams,
    });
  });

  test('findStoreById Method', async () => {
    const mockReturn = 'findStoreById String';
    mockPrisma.stores.findMany.mockReturnValue(mockReturn);

    const stores = await storesRepository.findAllStores();

    //한번만 호출
    expect(storesRepository.prisma.stores.findMany).toHaveBeenCalledTimes(1);

    expect(stores).toBe(mockReturn);
  });

  test('updateStore Method', async () => {
    const mockReturn = '업데이트 성공적으로 완료';
    const storeId = 1;
    const updateStoreParams = {
      storeName: '맥도날드',
      category: 'WESTERN',
      storeImage: 'test',
      storeIntro: '참깨빵 위에 순쇠고기',
      status: 'AVAILABLE',
      storeAddress: '테스트 주소22',
      storePhone: '01022220000',
      shippingFee: 4000,
    };
    const {
      storeName,
      category,
      storeImage,
      storeIntro,
      status,
      storeAddress,
      storePhone,
      shippingFee,
    } = updateStoreParams;

    mockPrisma.stores.update.mockReturnValue(mockReturn);
    const updateData = await storesRepository.updateStore(
        storeId, 
        storeName,
        category,
        storeImage,
        storeIntro,
        status,
        storeAddress,
        storePhone,
        shippingFee
    );
    
    expect(mockPrisma.stores.update).toHaveBeenCalledWith({
      where: { id:+storeId }, 
      data: updateStoreParams, 
    });
    
    expect(updateData).toBe(mockReturn);
    expect(mockPrisma.stores.update).toHaveBeenCalledTimes(1);
   
  });

  test('deleteStore Method', async () => {
    const mockReturn = 'delete Return String';
    const storeId = 1;

    mockPrisma.stores.delete.mockReturnValue(mockReturn);

    const deleteResult = await storesRepository.deleteStore(storeId);

    expect(deleteResult).toBe(mockReturn);
    expect(mockPrisma.stores.delete).toHaveBeenCalledTimes(1);
    expect(mockPrisma.stores.delete).toHaveBeenCalledWith({
      where: { id : storeId },
    });
  });
});
