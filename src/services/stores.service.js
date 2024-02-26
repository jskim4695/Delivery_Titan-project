import { ApiError } from '../middlewares/error-handling.middleware.js';

export class StoresService {
	constructor(storesRepository) {
		this.storesRepository = storesRepository;
	}

	/**
	 * 전체 업장 데이터 조회
	 * @returns
	 */
	findAllStores = async () => {
		const stores = await this.storesRepository.findAllStores();

        if (!stores) {
			throw new ApiError(404, `등록한 업장 데이터가 없습니다.`);
		}

		stores.sort((a, b) => {
			return b.createdAt - a.createdAt;
		});

		return stores.map((store) => {
			return {
				ownerId: store.ownerId,
				ownerNickname: store.user.nickname,
				storeName: store.storeName,
				category: store.category,
				contents: store.contents,
				storeImage: store.storeImage,
				storeIntro: store.storeIntro,
				status : store.status,
				storeAddress: store.storeAddress,
				storePhone: store.storePhone,
				shippingFee: store.shippingFee,
				createdAt: store.createdAt,
				updatedAt: store.updatedAt,
			};
		});
	}; // findAllStores

    /**
     * 
     * @param {*} ownerId 
     * @param {*} storeName 
     * @param {*} category 
     * @param {*} storeImage 
     * @param {*} storeIntro 
     * @returns 
     */
	createStore = async (ownerId, storeName, category, storeImage, storeIntro, status, storeAddress, storePhone, shippingFee) => {
		const createdStore = await this.storesRepository.createStore(
            ownerId,
            storeName,
            category,
            storeImage,
            storeIntro,
			status,
			storeAddress,
			storePhone,
			shippingFee,
		);

		return {
			ownerId: createdStore.ownerId,
			storeName: createdStore.storeName,
			category: createdStore.category,
			storeImage: createdStore.storeImage,
			storeIntro: createdStore.storeIntro,
			status: createdStore.status,
			storeAddress: createdStore.storeAddress,
			storePhone: createdStore.storePhone,
			shippingFee: createdStore.shippingFee,
			createdAt: createdStore.createdAt,
			updatedAt: createdStore.updatedAt,
		};
	}; // createdStore

	/**
	 * 특정 업장 조회
	 * @param {*} storeId
	 * @returns
	 */
	findStoreById = async (storeId) => {
		const store = await this.storesRepository.findStoreById(storeId);

		if (!store) {
			throw new ApiError(404, `등록한 업장이 없습니다.`);
		}

		return {
            ownerId: store.ownerId,
			ownerNickname: store.user.nickname,
            storeName: store.storeName,
            category: store.category,
            contents: store.contents,
            storeImage: store.storeImage,
            storeIntro: store.storeIntro,
			status : store.status,
			storeAddress: store.storeAddress,
			storePhone: store.storePhone,
			shippingFee: store.shippingFee,
            createdAt: store.createdAt,
            updatedAt: store.updatedAt,
		};
	};

	updateStore = async (
		storeId,
        storeName,
        category,
        storeImage,
        storeIntro,
		status,
		storeAddress,
		storePhone,
		shippingFee,
	) => {
		const store = await this.storesRepository.findStoreById(storeId);

		if (!store) {
			throw new ApiError(404, `해당 업장 정보가 없습니다.`);
		}

		// if (store.ownerId != loginId) {
		// 	throw new ApiError(403, `본인의 업장 정보만 수정 가능합니다.`);
		// }

		await this.storesRepository.updateStore(
            storeId,
            storeName,
            category,
            storeImage,
            storeIntro,
			status,
			storeAddress,
			storePhone,
			shippingFee,
		);

		return {
			message: '정상 수정되었습니다.',
		};
	};

	deleteStore = async (storeId, loginId) => {
		const store = await this.storesRepository.findStoreById(storeId);
		if (!store) {
			throw new ApiError(404, `존재하지 않는 업장입니다.`);
		}
		// if (store.ownerId != loginId) {
		// 	throw new ApiError(403, `본인 소유의 업장만 삭제 가능합니다.`);
		// }

		await this.storesRepository.deleteStore(storeId);

		return {
			message: '정상 삭제되었습니다.',
		};
	};
}
