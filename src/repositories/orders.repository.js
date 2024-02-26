export class OrderRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  getAddressByUserId = async (userId) => {
    const address = await this.prisma.users.findUnique({
      where: { id: +userId },
      select: { address: true },
    });
    return address;
  };

  createOrder = async (carts, userId, address) => {
    // 주문 생성후 카트 status, orderId 수정 & Stores의 orderCount += 1
    const order = await this.prisma.$transaction(async (tx) => {
      const order = await tx.orders.create({
        data: {
          storeId: +carts[0].storeId,
          totalPrice: +carts.totalPrice,
          userId: +userId,
          address,
        },
      });
      await tx.carts.update({
        where: { userId: +userId },
        data: {
          orderId: +order.id,
          status: "UNAVAILABLE",
        },
      });
      await tx.stores.update({
        where: { id: +carts[0].storeId },
        data: {
          orderCount: {
            increment: 1,
          },
        },
      });
      return order;
    });
    return order;
  };

  getStoreIdByOwnerId = async (ownerId) => {
    const storeId = await this.prisma.stores.findUnique({
      where: { ownerId: +ownerId },
    });
    return storeId;
  };

  getShippingFeeByStoreId = async (storeId) => {
    const shippingFee = await this.prisma.stores.findUnique({
      where: { id: +storeId },
      select: { shippingFee: true },
    });
    return shippingFee;
  };

  getOrdersByStoreId = async (storeId) => {
    // 주문 번호, 주문 주소, 주문 상태(역순 정렬)
    const orders = await this.prisma.orders.findMany({
      where: { storeId: +storeId },
      select: {
        id: true,
        address: true,
        status: true,
      },
      orderBy: {
        status: "desc",
        createdAt: "desc",
      },
    });
    // 메뉴 이름, 메뉴 이미지, 메뉴 가격, 주문 수량 (Carts 중 status가 unavailable인 것들)
    orders.forEach(async (order) => {
      // 1개 주문 당 N개 카트
      let menuList = [];
      const carts = await this.prisma.carts.findMany({
        where: {
          orderId: +order.id,
          status: "UNAVAILABLE",
        },
        select: {
          menuId: true,
          quantity: true,
        },
      });

      carts.forEach(async (cart) => {
        const menu = await this.prisma.menu.findUnique({
          where: { id: +cart.menuId },
          select: { menuImage: true, menuName: true, price: true },
        });
        menu.quantity = cart.quantity;
        menuList.add(menu);
      });

      order.menuList = menuList;
    });

    return orders;
  };

  updateStatus = async (orderId, status) => {
    const order = await this.prisma.orders.update({
      where: { id: +orderId },
      data: { status: status },
    });
    return order;
  };
}
