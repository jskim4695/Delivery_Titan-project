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

  /* 업장 저장 */
  createStore = async (req, res, next) => {
    try {
      const requiredFields = [
        'ownerId',
        'storeName',
        'category',
        'storeIntro',
        'status',
        'storeAddress',
        'storePhone',
        'shippingFee',
      ];
      const missingFields = requiredFields.filter((field) => !req.body[field]);
      if (!req.file) missingFields.push('storeImage');

      if (missingFields.length > 0) {
        throw new ApiError(
          404,
          `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`
        );
      }
      const {
        ownerId,
        storeName,
        category,
        storeIntro,
        status,
        storeAddress,
        storePhone,
        shippingFee,
      } = req.body;

      // 이미지
      const storeImage = req.file.location;

      const createdStore = await this.storesService.createStore(
        ownerId,
        storeName,
        category,
        storeImage,
        storeIntro,
        status,
        storeAddress,
        storePhone,
        shippingFee
      );
      return res.status(201).json({ data: createdStore });
    } catch (err) {
      next(err);
    }
  };

  /* 업장 1건 조회 */
  getStoreById = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      if (!storeId) {
        throw new ApiError(404, `업장 아이디를 받아오지 못했습니다.`);
      }

      const store = await this.storesService.findStoreById(+storeId);

      return res.status(200).json({ data: store });
    } catch (err) {
      if (err instanceof ApiError) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: '서버에서 에러가 발생했습니다.' });
      }
    }
  };

  getStoreByOwner = async (req, res, next) => {
    try {
      const { ownerId } = req.params;

      if (!ownerId) {
        throw new ApiError(404, `회원 아이디를 받아오지 못했습니다.`);
      }

      const store = await this.storesService.findStoreById(+ownerId);

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
      const {
        storeName,
        category,
        storeIntro,
        status,
        storeAddress,
        storePhone,
        shippingFee,
      } = req.body;

      const storeImage = req.file.location;

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
        shippingFee
      );

      return res.status(200).json({ data: updatedStore });
    } catch (err) {
      next(err);
    }
  };
  /* 업장 삭제 */
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
