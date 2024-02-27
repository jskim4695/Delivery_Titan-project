export class OrderService {
  constructor(orderRepository, cartRepository) {
    this.orderRepository = orderRepository;
    this.cartRepository = cartRepository;
  }

  createOrder = async (userId, address) => {
    // 카트에 주문할 것이 있는지 확인
    const carts = await this.cartRepository.getCartsByUserId(userId);
    if (carts.length === 0) throw new Error('장바구니가 텅 비었어요.');

    let totalPrice = 0;
    for (let i = 0; i < carts.length; i++) {
      const menu = await this.cartRepository.getMenuById(carts[i].menuId);
      totalPrice += menu.price * carts[i].quantity;
    }
    // 배송비
    const shippingFee = await this.orderRepository.getShippingFeeByStoreId(
      carts[0].storeId
    );

    totalPrice += shippingFee;

    // 사용자의 포인트 확인 : 포인트 < totalPrice면 에러
    const point = await this.orderRepository.getPointById(userId);
    if (point < totalPrice) throw new Error('포인트가 부족합니다.');

    carts.totalPrice = totalPrice;

    // address를 입력하지 않았으면 User 테이블의 사용자 address로 배송
    if (address == undefined || address == null) {
      address = await this.orderRepository.getAddressByUserId(userId);
      if (address == null) throw new Error('배송지를 입력해주세요.');
    }

    // 있으면 주문 생성
    const order = await this.orderRepository.createOrder(
      carts,
      userId,
      address
    );
    return order;
  };

  getOrdersByOwnerId = async (ownerId) => {
    const storeId = await this.orderRepository.getStoreIdByOwnerId(ownerId);
    const orders = await this.orderRepository.getOrdersByStoreId(storeId);
    return orders;
  };

  getOrdersByUserId = async (userId) => {
    const orders = await this.orderRepository.getOrdersByUserId(userId);
    return orders;
  };

  updateStatus = async (orderId, status) => {
    // 주문 존재하는지 확인
    const order = await this.orderRepository.getOrderById(orderId);
    if (!order) throw new Error('해당 주문이 존재하지 않습니다.');

    const order_status = [
      'ORDER_COMPLETE',
      'PREPARING',
      'DELIVERING',
      'DELIVERY_COMPLETE',
    ];

    if (
      !status ||
      status == undefined ||
      order_status.includes(status) == false
    )
      throw new Error('잘못된 상태입니다.');

    const updatedOrder = await this.orderRepository.updateStatus(
      orderId,
      status
    );

    return updatedOrder;
  };
}
