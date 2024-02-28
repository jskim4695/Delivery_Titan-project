import { ApiError } from '../middlewares/error-handling.middleware.js';

export class MenuController {
  constructor(menuService) {
    this.menuService = menuService;
  }

  /* 특정 업장 메뉴 전체 조회 */
  getMenu = async (req, res, next) => {
    try {
      const { storeId } = req.params;
      const menu = await this.menuService.findAllMenu(+storeId);

      if (!menu) {
        throw new ApiError(404, `해당 업장에 메뉴가 존재하지 않습니다.`);
      }
      return res.status(200).json({ data: menu });
    } catch (err) {
      next(err);
    }
  };

  /* 메뉴 저장 */
  createMenu = async (req, res, next) => {
    try {
      const requiredFields = ['storeId', 'menuName', 'menuInfo', 'price'];
      const missingFields = requiredFields.filter((field) => !req.body[field]);
      if (!req.file) missingFields.push('menuImage');

      if (missingFields.length > 0) {
        throw new ApiError(
          404,
          `필수 필드가 누락되었습니다: ${missingFields.join(', ')}`
        );
      }
      const { storeId, menuName, menuInfo, price } = req.body;

      // 이미지 부분 추가
      const menuImage = req.file.location;

      const createdMenu = await this.menuService.createMenu(
        storeId,
        menuName,
        menuInfo,
        menuImage,
        price
      );
      return res.status(201).json({ data: createdMenu });
    } catch (err) {
      next(err);
    }
  };

  /* 메뉴 1건 조회 */
  getMenuById = async (req, res, next) => {
    try {
      const { menuId } = req.params;

      if (!menuId) {
        throw new ApiError(404, `메뉴 아이디를 받아오지 못했습니다.`);
      }

      const menu = await this.menuService.findMenuById(+menuId);

      return res.status(200).json({ data: menu });
    } catch (err) {
      if (err instanceof ApiError) {
        res.status(err.status).json({ message: err.message });
      } else {
        res.status(500).json({ message: '서버에서 에러가 발생했습니다.' });
      }
    }
  };

  /* 메뉴 정보 업데이트 */
  updateMenu = async (req, res, next) => {
    try {
      const { menuId } = req.params;
      //const loginId = req.user.userId;
      const { menuName, menuInfo, price } = req.body;
      const menuImage = req.file.location;

      if (!menuId) {
        throw new ApiError(404, `메뉴 아이디를 받아오지 못했습니다.`);
      }

      const updatedMenu = await this.menuService.updateMenu(
        //loginId,
        menuId,
        menuName,
        menuInfo,
        menuImage,
        price
      );

      return res.status(200).json({ data: updatedMenu });
    } catch (err) {
      next(err);
    }
  };

  /* 메뉴 삭제 */
  deleteMenu = async (req, res, next) => {
    try {
      const { menuId } = req.params;
      //const loginId = req.user.userId;

      const deletedMenu = await this.menuService.deleteMenu(
        menuId
        //	loginId,
      );

      return res.status(200).json({ data: deletedMenu });
    } catch (err) {
      next(err);
    }
  };
}
