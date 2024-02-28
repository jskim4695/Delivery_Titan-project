import { ApiError } from '../middlewares/error-handling.middleware.js';
import { DeleteObjectCommand } from '@aws-sdk/client-s3';
import { bucketName, s3 } from '../utils/multer/multer.js';

export class MenuService {
  constructor(menuRepository, storesRepository) {
    this.menuRepository = menuRepository;
    this.storesRepository = storesRepository;
  }
  /**
   * 특정 업장 전체 메뉴 데이터 조회
   * @returns
   */
  findAllMenu = async (storeId) => {
    const menu = await this.menuRepository.findAllMenu(storeId);

    if (!menu) {
      throw new ApiError(404, `등록한 메뉴 데이터가 없습니다.`);
    }

    menu.sort((a, b) => {
      return b.createdAt - a.createdAt;
    });

    return menu.map((menu) => {
      return {
        storeId: menu.storeId,
        storeName: menu.store.storeName,
        menuName: menu.menuName,
        menuInfo: menu.menuInfo,
        menuImage: menu.menuImage,
        price: menu.price,
      };
    });
  }; // findAllMenu

  /**
   *
   * @param {*} ownerId
   * @param {*} menuName
   * @param {*} category
   * @param {*} menuImage
   * @param {*} menuIntro
   * @returns
   */
  createMenu = async (loginId, storeId, menuName, menuInfo, menuImage, price) => {
    const existingStore = await this.storesRepository.findStoreById(storeId);

    if (!existingStore) {
      throw new ApiError(404, `해당 업장이 존재하지 않습니다.`);
    }

    if (existingStore.ownerId != loginId) {
    	throw new ApiError(403, `본인의 업장에서만 메뉴 등록이 가능합니다.`);
    }

    const createdMenu = await this.menuRepository.createMenu(
      storeId,
      menuName,
      menuInfo,
      menuImage,
      price
    );

    return {
      storeId: createdMenu.storeId,
      menuName: createdMenu.menuName,
      menuInfo: createdMenu.menuInfo,
      menuImage: createdMenu.menuImage,
      price: createdMenu.price,
    };
  }; // createdMenu

  /**
   * 특정 업장 조회
   * @param {*} menuId
   * @returns
   */
  findMenuById = async (menuId) => {
    const menu = await this.menuRepository.findMenuById(menuId);

    if (!menu) {
      throw new ApiError(404, `해당 메뉴가 없습니다.`);
    }

    return {
      storeId: menu.storeId,
      storeName: menu.store.storeName,
      menuName: menu.menuName,
      menuImage: menu.menuImage,
      menuInfo: menu.menuInfo,
      price: menu.price,
    };
  };

  updateMenu = async (loginId, menuId, menuName, menuInfo, menuImage, price) => {
    const menu = await this.menuRepository.findMenuById(menuId);

    if (!menu) {
      throw new ApiError(404, `해당 메뉴 정보가 없습니다.`);
    }

    if (menu.store.ownerId != loginId) {
    	throw new ApiError(403, `본인의 업장 메뉴만 수정 가능합니다.`);
    }

    // menuImage를 업데이트 하려고 한다면, s3에서 기존 것 삭제
    if (menuImage != null || menuImage != undefined) {
      const imageName = menu.menuImage.split('com/')[1];
      const deleteCommand = new DeleteObjectCommand({
        Bucket: bucketName,
        Key: imageName,
      });
      try {
        await s3.send(deleteCommand);
      } catch (err) {
        next(err);
      }
    }

    await this.menuRepository.updateMenu(
      menuId,
      menuName,
      menuInfo,
      menuImage,
      price
    );

    return {
      message: '정상 수정되었습니다.',
    };
  };

  deleteMenu = async (menuId, loginId) => {
    const menu = await this.menuRepository.findMenuById(menuId);
    if (!menu) {
      throw new ApiError(404, `존재하지 않는 메뉴입니다.`);
    }
    if (menu.ownerId != loginId) {
    	throw new ApiError(403, `본인 소유의 업장에서만 메뉴 삭제가 가능합니다.`);
    }

    await this.menuRepository.deleteMenu(menuId);

    // s3 버킷에서 이미지 삭제
    const imageName = menu.menuImage.split('com/')[1];
    const deleteCommand = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: imageName,
    });
    try {
      await s3.send(deleteCommand);
    } catch (err) {
      next(err);
    }
    return {
      message: '정상 삭제되었습니다.',
    };
  };
}
