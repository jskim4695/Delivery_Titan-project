export class CartRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  createCart = async (storeId, menuId, userId) => {
    const cart = await this.prisma.carts.create({
      data: {
        menuId: +menuId,
        storeId: +storeId,
        userId: +userId,
      },
    });

    return cart;
  };

  deleteNcreateCart = async (storeId, menuId, userId, cartIds) => {
    const cart = await this.prisma.$transaction(async (tx) => {
      await tx.carts.deleteMany({
        where: {
          id: {
            in: cartIds,
          },
        },
      });
      const cart = await tx.carts.create({
        data: {
          menuId: +menuId,
          storeId: +storeId,
          userId: +userId,
        },
      });
      return cart;
    });
    return cart;
  };

  updateCart = async (cartId, quantity) => {
    const cart = await this.prisma.carts.update({
      where: { id: +cartId },
      data: { quantity: +quantity },
    });
    return cart;
  };

  getCartByUserIdNMenuId = async (userId, menuId) => {
    const cart = await this.prisma.carts.findFirst({
      where: { userId: +userId, menuId: +menuId },
    });
    return cart;
  };

  getCartsByUserId = async (userId) => {
    const carts = await this.prisma.carts.findMany({
      where: { userId: +userId, status: 'AVAILABLE' },
    });
    return carts;
  };

  getMenuById = async (menuId) => {
    const menu = await this.prisma.menu.findUnique({
      where: { id: +menuId },
    });
    return menu;
  };

  getStoreNameById = async (storeId) => {
    const storeName = await this.prisma.stores.findUnique({
      where: { id: +storeId },
      select: { storeName: true },
    });
    return storeName;
  };

  deleteCartById = async (cartId) => {
    await this.prisma.carts.delete({
      where: { id: +cartId },
    });
    return;
  };
}
