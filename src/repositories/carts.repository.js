export class CartRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  getCartByUserIdNMenuId = async (userId, menuId) => {
    const cart = await this.prisma.carts.findUnique({
      where: { userId: +userId, menuId: +menuId },
    });
    return cart;
  };

  createCart = async (storeId, menuId, userId) => {
    const cart = await this.prisma.$transaction(async (tx) => {
      await tx.carts.delete({
        where: { userId: +userId },
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

  updateCart = async (menuId, userId, quantity) => {
    const cart = await this.prisma.carts.update({
      where: { userId: +userId, menuId: +menuId },
      data: { quantity: +quantity },
    });
    return cart;
  };

  getCartsByUserId = async (userId) => {
    const carts = await this.prisma.carts.findMany({
      where: { userId: +userId },
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

  deleteMenuFromCart = async (menuId, userId) => {
    await this.prisma.carts.delete({
      where: { userId: +userId, menuId: +menuId },
    });
    return;
  };
}
