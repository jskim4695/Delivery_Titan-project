export class OrderService {
  constructor(orderRepository, cartRepository) {
    this.orderRepository = orderRepository;
    this.cartRepository = cartRepository;
  }

  createOrder = async (userId) => {
    // 카트에 주문할 것이 있는지 확인
    const carts = await this.cartRepository.getCartsByUserId(userId);
    if (carts.length === 0) throw new Error("장바구니가 텅 비었어요.");

    let totalPrice = 0;
    carts.forEach(async (cart) => {
      const menu = await this.cartRepository.getMenuById(cart.menuId);
      totalPrice += menu.price * cart.quantity;
    });
    carts.totalPrice = totalPrice;

    // 있으면 주문 생성
    const order = await this.orderRepository.createOrder(carts, userId);
    return order;
  };
}
