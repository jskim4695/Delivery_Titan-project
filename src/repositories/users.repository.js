import { prisma } from '../utils/prisma/index.js';
import bcrypt from 'bcrypt';

export class UserRepository {
  constructor(prisma) {
    this.prisma = prisma;
  }

  findOneUserByUserId = async (userId) => {
    const user = await prisma.users.findFirst({
      // 프리즈마에 접근해서 메소드를 통해 데이터를 가져왔음
      where: {
        userId,
      },
    });
    return user; // 그 데이터를 반환
  };

  selectOneUserByClientId = async (clientId) => {
    const user = await prisma.users.findFirst({
      where: {
        clientId,
      },
    });
    return user;
  };

  selectOneUserByEmail = async (email) => {
    const user = await prisma.users.findFirst({
      where: {
        email,
      },
    });
    return user;
  };

  createUser = async (data) => {
    const user = await prisma.users.create({
      data: {
        email: data.email,
        password: data.password,
        name: data.name,
        nickname: data.nickname,
        phone: data.phone,
        address: data.address,
        role: data.role,
      },
    });
    return user;
  };

  selectOneUserByEmailAndPassword = async (email, password) => {
    const user = await prisma.users.findFirst({
      where: {
        email,
        password,
      },
    });
    return user;
  };

  updateUserByUserId = async (userId, updatedData) => {
    const user = await prisma.users.findFirst({
      where: {
        userId,
      },
    });
    if (!user) {
      throw new Error('사용자를 찾을 수 없습니다.');
    }

    const updatedUser = await prisma.users.update(userId, updatedData);
    return updatedUser;
  };
}
