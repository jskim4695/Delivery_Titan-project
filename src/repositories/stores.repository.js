import { prisma } from '../utils/prisma/index.js';

export class StoresRepository {
  // 테스트를 위해 의존성 주입
  constructor(prisma) {
    this.prisma = prisma;
  }

<<<<<<< HEAD
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
=======
	findAllStores = async () => {
		let query = {
			select: {
				id: true,
				ownerId : true,
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
>>>>>>> f29f8640a9715fb7ad5b09573cd7f51036949196

    const stores = await this.prisma.stores.findMany(query);
    return stores;
  }; // findAllStores

<<<<<<< HEAD
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
=======
	createStore = async (ownerId, storeName, category, storeImage, storeIntro, status, storeAddress, storePhone, shippingFee) => {

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
>>>>>>> f29f8640a9715fb7ad5b09573cd7f51036949196

    return createdStore;
  }; //createStore

<<<<<<< HEAD
  findStoreById = async (storeId) => {
    const store = await this.prisma.stores.findUnique({
      where: { id: +storeId },
    });
=======
	findStoreById = async (storeId) => {
        let query = {
            where: { id: +storeId },
			select: {
				id: true,
				ownerId : true,
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
		const store = await this.prisma.stores.findUnique(
            query
        );
>>>>>>> f29f8640a9715fb7ad5b09573cd7f51036949196

    return store;
  }; //findStoreById

<<<<<<< HEAD
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
=======
	updateStore = async (storeId, storeName, category, storeImage, storeIntro, status, storeAddress, storePhone, shippingFee) => {
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
>>>>>>> f29f8640a9715fb7ad5b09573cd7f51036949196

  deleteStore = async (storeId) => {
    const deletedStore = await this.prisma.stores.delete({
      where: { id: +storeId },
    });
    return deletedStore;
  }; //deleteStore
}
