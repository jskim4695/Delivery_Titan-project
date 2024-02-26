export class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  /** 카트로 주문하기(고객) */
  createOrder = async (req, res, next) => {
    try {
      const { address } = req.body;
      const userId = req.userId;
      const order = await this.orderService.createOrder(userId, address);
      return res.status(201).json({ order });
    } catch (err) {
      next(err);
    }
  };

  /** 주문 확인하기(사장) */
  getOrders = async (req, res, next) => {
    try {
      const ownerId = req.userId;
      const orders = await this.orderService.getOrders(ownerId);
      return res.status(200).json({ orders });
    } catch (err) {
      next(err);
    }
  };

  /** 배달 완료로 주문 상태 변경하기 (사장) */
  updateStatus = async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      const order = await this.orderService.updateStatus(orderId, status);
      return res.status(200).json({ order });
    } catch (err) {
      next(err);
    }
  };
}
