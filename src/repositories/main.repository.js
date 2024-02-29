export class MainRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  getStoreIdsByMenu = async (searchWord) => {
    const storeIdList = await this.prisma.menu.findMany({
      where: {
        menuName: {
          contains: searchWord,
        },
      },
      select: {
        storeId: true,
      },
    });

    return storeIdList;
  };

  getStoreInfoById = async (id) => {
    const storeInfo = await this.prisma.stores.findFirst({
      where: { id: +id },
      select: {
        storeName: true,
        storeRate: true,
        storeIntro: true,
        storeImage: true,
      },
    });
    return storeInfo;
  };

  getAllStores = async () => {
    const stores = await this.prisma.stores.findMany({
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
    return stores;
  };

  getSortedStores = async (orderKey, orderValue) => {
    const sortedStores = await this.prisma.stores.findMany({
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
    return sortedStores;
  };

  getStoresNOrders = async () => {
    const stores = await this.prisma.stores.findMany({
      include: {
        orders: true,
      },
    });
    return stores;
  };
}
