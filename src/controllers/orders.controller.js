export class OrderController {
  constructor(orderService) {
    this.orderService = orderService;
  }

  /** 카트로 주문하기(고객) */
  createOrderByCart = async (req, res, next) => {
    try {
      const { address } = req.body;
      const userId = req.userId;
      const order = await this.orderService.createOrderByCart(userId, address);
      return res.status(201).json({ order });
    } catch (err) {
      next(err);
    }
  };

  /** 주문 확인하기 */
  getOrders = async (req, res, next) => {
    try {
      let orders = null;
      if (req.role == 'CUSTOMER') {
        //고객이 내 주문 목록 확인하기
        const userId = req.userId;
        orders = await this.orderService.getOrdersByUserId(userId);
      } else if (req.role == 'OWNER') {
        //사장이 주문 확인하기
        const ownerId = req.userId;
        orders = await this.orderService.getOrdersByOwnerId(ownerId);
      }
      return res.status(200).json({ orders });
    } catch (err) {
      next(err);
    }
  };

  /** 주문 상태 변경하기 (사장) */
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

  /** 메뉴로 단독 주문하기 (고객) */
  createOrderByMenu = async (req, res, next) => {
    try {
      const { menuId } = req.params;
      const { quantity, address } = req.body;
      const order = await this.orderService.createOrderByMenu(
        req.userId,
        menuId,
        quantity,
        address
      );
      return res.status(201).json({ order });
    } catch (err) {
      next(err);
    }
  };
}
