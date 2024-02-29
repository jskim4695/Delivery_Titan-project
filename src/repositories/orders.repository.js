export class OrderRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  getAddressByUserId = async (userId) => {
    const { address } = await this.prisma.users.findUnique({
      where: { id: +userId },
      select: { address: true },
    });
    return address;
  };

  createOrder = async (carts, userId, address) => {
    const order = await this.prisma.$transaction(async (tx) => {
      // 주문 생성
      const order = await tx.orders.create({
        data: {
          storeId: +carts[0].storeId,
          totalPrice: +carts.totalPrice,
          userId: +userId,
          address,
        },
      });
      //카트 status, orderId 수정
      await tx.carts.updateMany({
        where: { userId: +userId },
        data: {
          orderId: +order.id,
          status: 'UNAVAILABLE',
        },
      });
      // Stores의 orderCount += 1
      const store = await tx.stores.update({
        where: { id: +carts[0].storeId },
        data: {
          orderCount: {
            increment: 1,
          },
        },
      });
      // 사용자 포인트 차감
      await tx.users.update({
        where: { id: +userId },
        data: {
          point: {
            decrement: carts.totalPrice,
          },
        },
      });
      // 사장님 포인트 추가
      await tx.users.update({
        where: { id: +store.ownerId },
        data: {
          point: {
            increment: carts.totalPrice,
          },
        },
      });

      return order;
    });
    return order;
  };

  getPointById = async (userId) => {
    const { point } = await this.prisma.users.findUnique({
      where: { id: +userId },
      select: { point: true },
    });
    return point;
  };

  getStoreIdByOwnerId = async (ownerId) => {
    const storeId = await this.prisma.stores.findUnique({
      where: { ownerId: +ownerId },
      select: { id: true },
    });
    return storeId;
  };

  getShippingFeeByStoreId = async (storeId) => {
    const { shippingFee } = await this.prisma.stores.findUnique({
      where: { id: +storeId },
      select: { shippingFee: true },
    });
    return shippingFee;
  };

  getOrdersByStoreId = async (storeId) => {
    // 주문 번호, 주문 주소, 주문 상태
    const orders = await this.prisma.orders.findMany({
      where: { storeId: +storeId },
      select: {
        id: true,
        address: true,
        status: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // 메뉴 이름, 메뉴 이미지, 메뉴 가격, 주문 수량 (Carts 중 status가 unavailable인 것들)
    for (let i = 0; i < orders.length; i++) {
      // 1개 주문 당 N개 카트
      const carts = await this.prisma.carts.findMany({
        where: {
          orderId: +orders[i].id,
          status: 'UNAVAILABLE',
        },
        select: {
          menuId: true,
          quantity: true,
        },
      });

      let menuList = [];
      for (let j = 0; j < carts.length; j++) {
        const menu = await this.prisma.menu.findUnique({
          where: { id: +carts[j].menuId },
          select: { menuImage: true, menuName: true, price: true },
        });
        menu.quantity = carts[j].quantity;
        menuList.push(menu);
      }
      orders[i].menuList = menuList;
    }

    return orders;
  };

  getOrdersByUserId = async (userId) => {
    // 주문 번호, 주문 주소, 주문 상태
    const orders = await this.prisma.orders.findMany({
      where: { userId: +userId },
      select: {
        id: true,
        address: true,
        status: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    // 메뉴 이름, 메뉴 이미지, 메뉴 가격, 주문 수량 (Carts 중 status가 unavailable인 것들)
    for (let i = 0; i < orders.length; i++) {
      // 1개 주문 당 N개 카트
      const carts = await this.prisma.carts.findMany({
        where: {
          orderId: +orders[i].id,
          status: 'UNAVAILABLE',
        },
        select: {
          menuId: true,
          quantity: true,
        },
      });

      let menuList = [];
      for (let j = 0; j < carts.length; j++) {
        const menu = await this.prisma.menu.findUnique({
          where: { id: +carts[j].menuId },
          select: { menuImage: true, menuName: true, price: true },
        });
        menu.quantity = carts[j].quantity;
        menuList.push(menu);
      }
      orders[i].menuList = menuList;
    }

    return orders;
  };

  getOrderById = async (orderId) => {
    const order = await this.prisma.orders.findUnique({
      where: { id: +orderId },
    });
    return order;
  };
  updateStatus = async (orderId, status) => {
    const order = await this.prisma.orders.update({
      where: { id: +orderId },
      data: { status: status },
    });
    return order;
  };
}
