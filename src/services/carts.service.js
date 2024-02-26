export class CartService {
  constructor(cartRepository) {
    this.cartRepository = cartRepository;
  }

  addToCart = async (storeId, menuId, userId) => {
    // 사용자의 cart 가져오기(userId, menuId로)
    let cart = await this.cartRepository.getCartByUserIdNMenuId(userId, menuId);
    if (!cart || cart.storeId != storeId) {
      // 기존것 삭제 및 새로 생성
      cart = await this.cartRepository.createCart(storeId, menuId, userId);
    } else {
      // 기존것 업데이트
      const quantity = cart.quantity;
      cart = await this.cartRepository.updateCart(menuId, userId, quantity + 1);
    }
    return cart;
  };

  updateQuantity = async (menuId, userId, quantity) => {
    const cart = await this.cartRepository.updateCart(menuId, userId, quantity);
    return cart;
  };

  getCart = async (userId) => {
    const carts = await this.cartRepository.getCartsByUserId(userId);
    let totalPrice = 0;
    carts.forEach(async (cart) => {
      const menu = await this.cartRepository.getMenuById(cart.menuId);
      cart.menuName = menu.menuName;
      cart.menuInfo = menu.menuInfo;
      cart.menuImage = menu.menuImage;
      cart.price = menu.price;
      totalPrice += cart.price * cart.quantity;
    });
    carts.totalPrice = totalPrice;
    return carts;
  };
}
