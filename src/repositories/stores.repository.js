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
    storeIntro
  ) => {
    const createdStore = await this.prisma.stores.create({
      data: {
        ownerId,
        storeName,
        category,
        storeImage,
        storeIntro,
      },
    });

    return createdStore;
  }; //createStore

  findStoreById = async (storeId) => {
    const store = await this.prisma.stores.findUnique({
      where: { id: +storeId },
    });

    return store;
  }; //findStoreById

  updateStore = async (
    storeId,
    storeName,
    category,
    storeImage,
    storeIntro
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
