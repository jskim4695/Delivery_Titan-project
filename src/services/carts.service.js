export class CartService {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  addToCart = async (storeId, menuId, userId) => {
    const isExistMenu = await this.cartRepository.getMenuById(menuId);
    if (isExistMenu.storeId != storeId)
      throw new Error(
        '해당 가게에는 존재하지 않는 메뉴입니다. 다른 메뉴 아이디를 입력해주세요.'
      );

    // 사용자의 cart 가져오기(userId로)
    let cart = await this.cartRepository.getCartByUserId(userId);

    if (!cart) {
      // 새로 생성
      cart = await this.cartRepository.createCart(storeId, menuId, userId);
    } else if (cart.storeId != storeId) {
      // 기존것 삭제 및 새로 생성
      cart = await this.cartRepository.deleteNcreateCart(
        storeId,
        menuId,
        userId,
        cart.id
      );
    } else if (cart.menuId == menuId) {
      const qty = cart.quantity + 1;
      cart = await this.cartRepository.updateCart(cart.id, qty);
    } else {
      cart = await this.cartRepository.createCart(storeId, menuId, userId);
    }
    return cart;
  };

  updateQuantity = async (storeId, menuId, userId, quantity) => {
    if (quantity == undefined || quantity == null)
      throw new Error('변경하시려는 quantity를 입력해주세요.');

    const isExistCart = await this.cartRepository.getCartByUserIdNMenuId(
      userId,
      menuId
    );

    if (!isExistCart) throw new Error('카트에 존재하지 않는 메뉴입니다');

    if (isExistCart.storeId != storeId) throw new Error('잘못된 파라미터');

    const cart = await this.cartRepository.updateCart(isExistCart.id, quantity);
    return cart;
  };

  // 식당 이름, 메뉴 이름, 메뉴 이미지, 메뉴 가격, 메뉴 수량, 총 가격
  getCart = async (userId) => {
    const carts = await this.cartRepository.getCartsByUserId(userId);
    if (carts.length === 0) return carts;
    const { storeName } = await this.cartRepository.getStoreNameById(
      carts[0].storeId
    );
    carts.storeName = storeName;

    let totalPrice = 0;
    for (let i = 0; i < carts.length; i++) {
      const menu = await this.cartRepository.getMenuById(carts[i].menuId);
      carts[i].menuName = menu.menuName;
      carts[i].menuImage = menu.menuImage;
      carts[i].price = menu.price;
      totalPrice += menu.price * carts[i].quantity;
    }

    carts.totalPrice = totalPrice;
    return carts;
  };

  deleteMenu = async (menuId, userId) => {
    const isExistCart = await this.cartRepository.getCartByUserIdNMenuId(
      userId,
      menuId
    );
    if (!isExistCart) throw new Error('카트에 존재하지 않는 메뉴입니다');

    await this.cartRepository.deleteCartById(isExistCart.id);
    return;
  };
}
