export class CartController {
  constructor(cartService) {
    this.cartService = cartService;
  }

  /** 카트에 담기(메뉴 추가하기) */
  addToCart = async (req, res, next) => {
    try {
      const { storeId, menuId } = req.params;
      const userId = req.userId;

      const cart = await this.cartService.addToCart(storeId, menuId, userId);
      return res.status(200).json({ cart });
    } catch (err) {
      next(err);
    }
  };
  //   let cart = req.session.cart ? req.session.cart : {}; // 세션에서 cart 가져오기(없으면 생성)
  //   if (cart.storeId && cart.storeId != storeId) {
  //     // 세션에서 가져온 cart에 storeId가 다르면 초기화
  //     cart = {};
  //   }
  //   cart.storeId = storeId;
  //   let quantity = cart[menuId] ? cart[menuId] : 0;
  //   cart[menuId] = quantity + 1;
  //   req.session.cart = cart;

  /** 카트에 담긴 메뉴 수량 변경 */
  updateQuantity = async (req, res, next) => {
    try {
      const { storeId, menuId } = req.params;
      const { quantity } = req.body;
      const userId = req.userId;

      const cart = await this.cartService.updateQuantity(
        storeId,
        menuId,
        userId,
        quantity
      );
      return res.status(200).json({ cart });
    } catch (err) {
      next(err);
    }
  };

  /** 내 카트 조회(메뉴 정보 포함) */
  getCart = async (req, res, next) => {
    try {
      const userId = req.userId;
      const cart = await this.cartService.getCart(userId);
      return res.status(200).json({ cart });
    } catch (err) {
      next(err);
    }
  };

  /** 카트에서 삭제 */
  deleteMenu = async (req, res, next) => {
    try {
      const { menuId } = req.params;
      const userId = req.userId;
      await this.cartService.deleteMenu(menuId, userId);
      const cart = await this.cartService.getCart(userId);
      return res.status(200).json({ cart });
    } catch (err) {
      next(err);
    }
  };
}
