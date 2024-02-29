import {
  BadRequestError,
  NotFoundError,
} from '../middlewares/error-handling.middleware.js';

export class MainService {
  constructor(mainRepository) {
    this.mainRepository = mainRepository;
  }

  searchMenu = async (searchWord) => {
    if (!searchWord.trim())
      throw new BadRequestError('공백 문자열로 검색할 수 없습니다.');

    const storeIdList = await this.mainRepository.getStoreIdsByMenu(searchWord);
    if (storeIdList.length === 0)
      throw new NotFoundError('검색 결과가 없습니다.');

    for (let i = 0; i < storeIdList.length; i++) {
      const storeInfo = await this.mainRepository.getStoreInfoById(
        storeIdList[i].storeId
      );
      storeIdList[i].storeInfo = storeInfo;
    }
    return storeIdList;
  };

  getAllStores = async () => {
    const stores = await this.mainRepository.getAllStores();
    return stores;
  };

  sortStores = async (orderKey, orderValue) => {
    if (
      !orderKey ||
      orderKey == undefined ||
      !orderValue ||
      orderValue == undefined
    )
      throw new BadRequestError('orderKey와 orderValue를 입력해주세요.');
    // 주문 많은 순, 평점순, 기본순(업장 이름), 배달비 순
    const keyList = [
      'orderCount',
      'storeRate',
      'storeName',
      'shippingFee',
      'createdAt',
    ];
    if (!keyList.includes(orderKey))
      throw new BadRequestError(
        'orderKey는 orderCount, storeRate, storeName, shippingFee, createdAt 중 하나여야 합니다.'
      );
    const valueList = ['asc', 'desc'];
    if (!valueList.includes(orderValue))
      throw new BadRequestError('orderValue는 asc나 desc 여야 합니다.');

    const sortedStores = await this.mainRepository.getSortedStores(
      orderKey,
      orderValue
    );
    return sortedStores;
  };

  getStoreRanking = async () => {
    const stores = await this.mainRepository.getStoresNOrders();
    const ranking = [];
    for (const store of stores) {
      const sales = store.orders.reduce(
        (acc, curr) => acc + curr.totalPrice,
        0
      );
      const storeInfo = {
        id: store.id,
        ownerId: store.ownerId,
        storeName: store.storeName,
        category: store.category,
        storeImage: store.storeImage,
        storeRate: store.storeRate,
        orderCount: store.orderCount,
        status: store.status,
        sales,
      };
      ranking.push(storeInfo);
    }
    ranking.sort((a, b) => b.sales - a.sales);
    return ranking;
  };
}
