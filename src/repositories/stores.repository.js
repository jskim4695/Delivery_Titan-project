import { prisma } from '../utils/prisma/index.js';

export class StoresRepository {
  // 테스트를 위해 의존성 주입
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllStores = async () => {
    let query = {
      select: {
        id: true,
        ownerId: true,
        storeName: true,
        category: true,
        storeImage: true,
        storeIntro: true,
        storeRate: true,
        orderCount: true,
        status: true,
        storeAddress: true,
        storePhone: true,
        shippingFee: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
      // orderBy: {
      // 	[orderKey || 'createdAt']: validOrderValue,
      // },
    };

    const stores = await this.prisma.stores.findMany(query);
    return stores;
  }; // findAllStores

  createStore = async (
    ownerId,
    storeName,
    category,
    storeImage,
    storeIntro,
    status,
    storeAddress,
    storePhone,
    shippingFee
  ) => {
    const createdStore = await this.prisma.stores.create({
      data: {
        ownerId,
        storeName,
        category,
        storeImage,
        storeIntro,
        status,
        storeAddress,
        storePhone,
        shippingFee,
      },
    });

    return createdStore;
  }; //createStore

  findStoreById = async (storeId) => {
    let query = {
      where: { id: +storeId },
      select: {
        id: true,
        ownerId: true,
        storeName: true,
        category: true,
        storeImage: true,
        storeIntro: true,
        storeRate: true,
        orderCount: true,
        status: true,
        storeAddress: true,
        storePhone: true,
        shippingFee: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
    };
    const store = await this.prisma.stores.findUnique(query);

    return store;
  }; //findStoreById

  findStoreByOwner = async (ownerId) => {
    let query = {
      where: { ownerId: +ownerId },
      select: {
        id: true,
        ownerId: true,
        storeName: true,
        category: true,
        storeImage: true,
        storeIntro: true,
        storeRate: true,
        orderCount: true,
        status: true,
        storeAddress: true,
        storePhone: true,
        shippingFee: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            nickname: true,
          },
        },
      },
    };
    const store = await this.prisma.stores.findFirst(query);

    return store;
  }; //findStoreById

  updateStore = async (
    storeId,
    storeName,
    category,
    storeImage,
    storeIntro,
    status,
    storeAddress,
    storePhone,
    shippingFee
  ) => {
    const updatedStore = await this.prisma.stores.update({
      where: {
        id: +storeId,
      },
      data: {
        ...(storeName && { storeName }),
        ...(category && { category }),
        storeImage,
        storeIntro,
        ...(status && { status }),
        storeAddress,
        storePhone,
        shippingFee,
      },
    });
    return updatedStore;
  }; //updateStore

  deleteStore = async (storeId) => {
    const deletedStore = await this.prisma.stores.delete({
      where: { id: +storeId },
    });
    return deletedStore;
  }; //deleteStore
}
