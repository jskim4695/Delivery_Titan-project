import { ApiError } from '../middlewares/error-handling.middleware.js';

export class StoresController {
  constructor(storesService) {
    this.storesService = storesService;
  }

  /* 조회 */
  getStores = async (req, res, next) => {
    try {
      const stores = await this.storesService.findAllStores();
      return res.status(200).json({ data: stores });
    } catch (err) {
      next(err);
    }
  };

<<<<<<< HEAD
  /* 업장 저장 */
  createStore = async (req, res, next) => {
    try {
      const requiredFields = [
        'ownerId',
        'storeName',
        'category',
        'storeImage',
        'storeIntro',
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);

      if (missingFields.length > 0) {
        throw new ApiError(
          404,
          `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`
        );
      }
      const { ownerId, storeName, category, storeImage, storeIntro } = req.body;

      const createdStore = await this.storesService.createStore(
        ownerId,
        storeName,
        category,
        storeImage,
        storeIntro
      );
      return res.status(201).json({ data: createdStore });
    } catch (err) {
      next(err);
    }
  };
=======
	/* 업장 저장 */
	createStore = async (req, res, next) => {
		try {
			const requiredFields = ['ownerId', 'storeName', 'category', 'storeImage', 'storeIntro', 'status', 'storeAddress', 'storePhone', 'shippingFee'];
            const missingFields = requiredFields.filter(field => !req.body[field]);

            if (missingFields.length > 0) {
                throw new ApiError(404, `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`);
            }
            const { ownerId, storeName, category, storeImage, storeIntro, status, storeAddress, storePhone, shippingFee } = req.body;

			const createdStore = await this.storesService.createStore(
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
			return res.status(201).json({ data: createdStore });
		} catch (err) {
			next(err);
		}
	};
>>>>>>> f29f8640a9715fb7ad5b09573cd7f51036949196

  /* 업장 1건 조회 */
  getStoreById = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const store = await this.storesService.findStoreById(+storeId);

      if (!store) {
        throw new ApiError(404, `해당 업장이 존재하지 않습니다.`);
      }

<<<<<<< HEAD
      return res.status(200).json({ data: store });
    } catch (err) {
      if (err instanceof ApiError) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: '서버에서 에러가 발생했습니다.' });
      }
    }
  };

  /* 업장 정보 업데이트 */
  updateStore = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      //const loginId = req.user.userId;
      const { storeName, category, storeImage, storeIntro } = req.body;
=======
	/* 업장 정보 업데이트 */
	updateStore = async (req, res, next) => {
		try {
			const { storeId } = req.params;
			//const loginId = req.user.userId;
			const { storeName, category, storeImage, storeIntro, status, storeAddress, storePhone, shippingFee } = req.body;

			const updatedStore = await this.storesService.updateStore(
                //loginId,
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
>>>>>>> f29f8640a9715fb7ad5b09573cd7f51036949196

      const updatedStore = await this.storesService.updateStore(
        //loginId,
        storeId,
        storeName,
        category,
        storeImage,
        storeIntro
      );

<<<<<<< HEAD
      return res.status(200).json({ data: updatedStore });
    } catch (err) {
      next(err);
    }
  };
=======
	/* 업장 삭제 */
	deleteStore = async (req, res, next) => {
		try {
			const { storeId } = req.params;
			//const loginId = req.user.userId;
>>>>>>> f29f8640a9715fb7ad5b09573cd7f51036949196

  /* 이력서 삭제 */
  deleteStore = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      //const loginId = req.user.userId;

      const deletedStore = await this.storesService.deleteStore(
        storeId
        //	loginId,
      );
      return res.status(200).json({ data: deletedStore });
    } catch (err) {
      next(err);
    }
  };
}
