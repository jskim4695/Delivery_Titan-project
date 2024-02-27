import { prisma } from '../utils/prisma/index.js';

export class MenuRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findAllMenu = async (storeId) => {
    let query = {
      where: {
        storeId: +storeId,
      },
      select: {
        id: true,
        storeId: true,
        menuName: true,
        menuInfo: true,
        menuImage: true,
        price: true,
        store: {
          select: {
            storeName: true,
          },
        },
      },
    };

    const menu = await this.prisma.menu.findMany(query);
    return menu;
  }; // findAllMenu

  createMenu = async (storeId, menuName, menuInfo, menuImage, price) => {
    const createdMenu = await this.prisma.menu.create({
      data: {
        storeId,
        menuName,
        menuInfo,
        menuImage,
        price,
      },
    });

    return createdMenu;
  }; //createMenu

  findMenuById = async (menuId) => {
    let query = {
      where: { id: +menuId },
      select: {
        id: true,
        storeId: true,
        menuName: true,
        menuInfo: true,
        menuImage: true,
        price: true,
        store: {
          select: {
            storeName: true,
          },
        },
      },
    };
    const menu = await this.prisma.menu.findUnique(query);

    return menu;
  }; //findMenuById

  updateMenu = async (menuId, menuName, menuInfo, menuImage, price) => {
    const updatedMenu = await this.prisma.menu.update({
      where: {
        id: +menuId,
      },
      data: {
        ...(menuName && { menuName }),
        menuInfo,
        ...(price && { price }),
        menuImage,
      },
    });
    return updatedMenu;
  }; //updateMenu

  deleteMenu = async (menuId) => {
    const deletedMenu = await this.prisma.menu.delete({
      where: { id: +menuId },
    });
    return deletedMenu;
  }; //deleteMenu
}
