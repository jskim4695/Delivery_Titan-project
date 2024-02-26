export class OrderRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createOrder = async (carts, userId) => {
    // 주문 생성후 카트 삭제 & Stores의 orderCount += 1
    const order = await this.prisma.$transaction(async (tx) => {
      const order = await tx.orders.create({
        data: {
          storeId: +carts[0].storeId,
          totalPrice: +carts.totalPrice,
          userId: +userId,
        },
      });
      await tx.carts.delete({
        where: { userId: +userId },
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
}
