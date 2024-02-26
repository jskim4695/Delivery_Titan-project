export class OrderService {
  constructor(orderRepository, cartRepository) {
    this.orderRepository = orderRepository;
    this.cartRepository = cartRepository;
  }

  createOrder = async (userId, address) => {
    // 카트에 주문할 것이 있는지 확인
    const carts = await this.cartRepository.getCartsByUserId(userId);
    if (carts.length === 0) throw new Error("장바구니가 텅 비었어요.");

    let totalPrice = 0;
    carts.forEach(async (cart) => {
      const menu = await this.cartRepository.getMenuById(cart.menuId);
      totalPrice += menu.price * cart.quantity;
    });
    // 배송비
    const shippingFee = await this.orderRepository.getShippingFeeByStoreId(
      carts[0].storeId
    );
    totalPrice += shippingFee;
    carts.totalPrice = totalPrice;

    // address를 입력하지 않았으면 User 테이블의 사용자 address로 배송
    if (address === undefined)
      address = await this.orderRepository.getAddressByUserId(userId);
    // 있으면 주문 생성
    const order = await this.orderRepository.createOrder(
      carts,
      userId,
      address
    );
    return order;
  };

  getOrders = async (ownerId) => {
    const storeId = await this.orderRepository.getStoreIdByOwnerId(ownerId);
    const orders = await this.orderRepository.getOrdersByStoreId(storeId);
    return orders;
  };
}
